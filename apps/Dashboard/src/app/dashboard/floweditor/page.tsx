import React from "react";

import CategoryFlowEditor from "./CategoryFlowEditor";

function App() {
	return (
		<div style={{ margin: 16 }}>
			<h1>Category Flow Editor Demo</h1>
			<p>Hier kannst du Steps hinzufügen, sortieren, konfigurieren.</p>
			<CategoryFlowEditor categoryId="123" />
		</div>
	);
}

export default App;
