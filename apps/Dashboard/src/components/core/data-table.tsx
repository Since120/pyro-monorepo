"use client";

import type * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import type { TableProps } from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

/** --------------------------------
 * Definitionen
 * -------------------------------- */
export interface ColumnDef<TRowModel> {
	align?: "left" | "right" | "center";
	field?: keyof TRowModel;
	formatter?: (row: TRowModel, index: number) => React.ReactNode;
	hideName?: boolean;
	name: string;
	width?: number | string;
}

type RowId = number | string;

/**
 * rowStyle? => Du kannst pro Zeile ein CSS-Style zurückgeben.
 *  z. B. (row) => ({ backgroundColor: "red" })
 */
export interface DataTableProps<TRowModel> extends Omit<TableProps, "onClick"> {
	columns: ColumnDef<TRowModel>[];
	hideHead?: boolean;
	hover?: boolean;
	onClick?: (event: React.MouseEvent, row: TRowModel) => void;
	onDeselectAll?: (event: React.ChangeEvent) => void;
	onDeselectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
	onSelectAll?: (event: React.ChangeEvent) => void;
	onSelectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
	rows: TRowModel[];
	selectable?: boolean;
	selected?: Set<RowId>;
	uniqueRowId?: (row: TRowModel) => RowId;
	rowStyle?: (row: TRowModel, index: number) => React.CSSProperties;
}

/** --------------------------------
 * DataTable
 * -------------------------------- */
export function DataTable<TRowModel extends object & { id?: RowId | null }>(
	props: DataTableProps<TRowModel>
): React.JSX.Element {
	// 1) rowStyle & relevante Props extrahieren, damit wir rowStyle NICHT an <Table> weitergeben.
	const {
		columns,
		hideHead,
		hover,
		onClick,
		onDeselectAll,
		onDeselectOne,
		onSelectAll,
		onSelectOne,
		rows,
		selectable,
		selected,
		uniqueRowId,
		rowStyle, // <--- Wir fangen rowStyle hier ab
		...tableProps // <--- Alles andere geht an <Table>
	} = props;

	// 2) Bestehende Logik: selectedSome / selectedAll
	const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
	const selectedAll = rows.length > 0 && selected?.size === rows.length;

	// 3) Render
	return (
		<Table {...tableProps}>
			<TableHead
				sx={{
					...(hideHead && { visibility: "collapse", "--TableCell-borderWidth": 0 }),
				}}
			>
				<TableRow>
					{selectable ? (
						<TableCell padding="checkbox" sx={{ width: "40px", minWidth: "40px", maxWidth: "40px" }}>
							<Checkbox
								checked={selectedAll}
								indeterminate={selectedSome}
								onChange={(event: React.ChangeEvent) => {
									if (selectedAll) {
										onDeselectAll?.(event);
									} else {
										onSelectAll?.(event);
									}
								}}
							/>
						</TableCell>
					) : null}
					{columns.map(
						(column): React.JSX.Element => (
							<TableCell
								key={column.name}
								sx={{
									width: column.width,
									minWidth: column.width,
									maxWidth: column.width,
									...(column.align && { textAlign: column.align }),
								}}
							>
								{column.hideName ? null : column.name}
							</TableCell>
						)
					)}
				</TableRow>
			</TableHead>

			<TableBody>
				{rows.map((row, index): React.JSX.Element => {
					// 4) rowId & rowSelected
					const rowId = row.id ?? uniqueRowId?.(row);
					const rowSelected = rowId ? selected?.has(rowId) : false;

					// 5) rowStyle => an <TableRow sx={}>;
					return (
						<TableRow
							hover={hover}
							key={rowId ?? index}
							selected={rowSelected}
							// Falls onClick => row click
							{...(onClick && {
								onClick: (event: React.MouseEvent) => {
									onClick(event, row);
								},
							})}
							sx={{
								...(onClick && { cursor: "pointer" }),
								...(rowStyle ? rowStyle(row, index) : {}),
							}}
						>
							{selectable ? (
								<TableCell padding="checkbox">
									<Checkbox
										checked={rowId ? rowSelected : false}
										onChange={(event: React.ChangeEvent) => {
											if (rowSelected) {
												onDeselectOne?.(event, row);
											} else {
												onSelectOne?.(event, row);
											}
										}}
										onClick={(event: React.MouseEvent) => {
											// Verhindert event-Bubbling => rowClick
											if (onClick) event.stopPropagation();
										}}
									/>
								</TableCell>
							) : null}

							{columns.map((column): React.JSX.Element => {
								// 6) Feld-Output => forcibly cast zu React.ReactNode
								let content: React.ReactNode;

								if (column.formatter) {
									// custom => e.g. (row) => ...
									content = column.formatter(row, index);
								} else if (column.field) {
									// Feld-Ausgabe => cast
									const val = row[column.field];
									content = val as unknown as React.ReactNode;
								} else {
									content = null;
								}

								return (
									<TableCell
										key={column.name}
										sx={{
											...(column.align && { textAlign: column.align }),
										}}
									>
										{content}
									</TableCell>
								);
							})}
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}
