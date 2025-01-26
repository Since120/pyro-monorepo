"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Delete } from "@mui/icons-material";

// Wir definieren ein paar Typen
type ConditionType = "userJoinedVoice" | "dashboardSetupClick";
type ActionType = "sendPrivateMessage" | "askTracking" | "channelChoice";

interface ConditionDefinition {
  conditionType: ConditionType;
  config: any;
}

interface ActionDefinition {
  actionType: ActionType;
  config: any;
}

interface RuleDefinition {
  id: string;
  condition: ConditionDefinition;
  actions: ActionDefinition[];
}

// Unsere Haupt-Komponente
export default function RuleConfigurator() {
  const [rules, setRules] = useState<RuleDefinition[]>([]);

  const handleAddRule = () => {
    const newRule: RuleDefinition = {
      id: Math.random().toString(36).substr(2, 9),
      condition: {
        conditionType: "userJoinedVoice",
        config: {},
      },
      actions: [],
    };
    setRules((prev) => [...prev, newRule]);
  };

  const handleRemoveRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveRule = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= rules.length) return;

    const updated = [...rules];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setRules(updated);
  };

  const handleChangeConditionType = (ruleId: string, newType: ConditionType) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? { ...r, condition: { conditionType: newType, config: {} } }
          : r
      )
    );
  };

  const handleConditionConfigChange = (ruleId: string, key: string, value: any) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        return {
          ...r,
          condition: {
            ...r.condition,
            config: {
              ...r.condition.config,
              [key]: value,
            },
          },
        };
      })
    );
  };

  const handleAddAction = (ruleId: string) => {
    const newAction: ActionDefinition = {
      actionType: "sendPrivateMessage",
      config: {},
    };
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        return {
          ...r,
          actions: [...r.actions, newAction],
        };
      })
    );
  };

  const handleRemoveAction = (ruleId: string, actionIndex: number) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        return {
          ...r,
          actions: r.actions.filter((_, i) => i !== actionIndex),
        };
      })
    );
  };

  const handleChangeActionType = (ruleId: string, actionIndex: number, newType: ActionType) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        const updatedActions = [...r.actions];
        updatedActions[actionIndex] = { actionType: newType, config: {} };
        return { ...r, actions: updatedActions };
      })
    );
  };

  const handleActionConfigChange = (ruleId: string, actionIndex: number, key: string, value: any) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        const updatedActions = [...r.actions];
        updatedActions[actionIndex] = {
          ...updatedActions[actionIndex],
          config: {
            ...updatedActions[actionIndex].config,
            [key]: value,
          },
        };
        return { ...r, actions: updatedActions };
      })
    );
  };

  const handleSaveAll = () => {
    alert("Aktuelle Rules: \n" + JSON.stringify(rules, null, 2));
    // In echt: fetch("/api/saveFlow", { method: "POST", body: JSON.stringify(rules) })
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} mb={2}>
        <Button variant="contained" onClick={handleAddRule}>
          + Add Rule
        </Button>
        <Button variant="outlined" onClick={handleSaveAll}>
          Save All Rules
        </Button>
      </Stack>

      {rules.map((rule, index) => (
        <Card key={rule.id} sx={{ mb: 2 }}>
          <CardHeader
            title={
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Rule #{index + 1}</Typography>
                <Box>
                  <IconButton onClick={() => handleMoveRule(index, -1)} disabled={index === 0}>
                    <ArrowUpward />
                  </IconButton>
                  <IconButton
                    onClick={() => handleMoveRule(index, 1)}
                    disabled={index === rules.length - 1}
                  >
                    <ArrowDownward />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveRule(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Stack>
            }
          />
          <Divider />
          <CardContent>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              IF:
            </Typography>

            <Stack direction="row" spacing={2} mt={1} mb={3}>
              <Select
                value={rule.condition.conditionType}
                onChange={(e) =>
                  handleChangeConditionType(rule.id, e.target.value as ConditionType)
                }
                sx={{ width: 250 }}
              >
                <MenuItem value="userJoinedVoice">UserJoinedVoice</MenuItem>
                <MenuItem value="dashboardSetupClick">DashboardSetupClick</MenuItem>
              </Select>

              {/* Minimales Config-Feld */}
              {rule.condition.conditionType === "userJoinedVoice" && (
                <TextField
                  label="Category Name?"
                  value={rule.condition.config.categoryName ?? ""}
                  onChange={(e) =>
                    handleConditionConfigChange(rule.id, "categoryName", e.target.value)
                  }
                />
              )}
              {rule.condition.conditionType === "dashboardSetupClick" && (
                <TextField
                  label="Setup Key?"
                  value={rule.condition.config.setupKey ?? ""}
                  onChange={(e) =>
                    handleConditionConfigChange(rule.id, "setupKey", e.target.value)
                  }
                />
              )}
            </Stack>

            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              THEN DO:
            </Typography>

            {rule.actions.map((action, aIndex) => (
              <Stack key={aIndex} direction="row" spacing={2} sx={{ mt: 1, mb: 1 }}>
                <Select
                  value={action.actionType}
                  onChange={(e) =>
                    handleChangeActionType(rule.id, aIndex, e.target.value as ActionType)
                  }
                  sx={{ width: 220 }}
                >
                  <MenuItem value="sendPrivateMessage">SendPrivateMessage</MenuItem>
                  <MenuItem value="askTracking">AskTracking</MenuItem>
                  <MenuItem value="channelChoice">ChannelChoice</MenuItem>
                </Select>

                {action.actionType === "sendPrivateMessage" && (
                  <TextField
                    label="PN Text"
                    value={action.config.message ?? ""}
                    onChange={(e) =>
                      handleActionConfigChange(rule.id, aIndex, "message", e.target.value)
                    }
                  />
                )}
                {action.actionType === "askTracking" && (
                  <TextField
                    label="Frage Text"
                    value={action.config.question ?? ""}
                    onChange={(e) =>
                      handleActionConfigChange(rule.id, aIndex, "question", e.target.value)
                    }
                  />
                )}
                {action.actionType === "channelChoice" && (
                  <TextField
                    label="Label"
                    value={action.config.label ?? ""}
                    onChange={(e) =>
                      handleActionConfigChange(rule.id, aIndex, "label", e.target.value)
                    }
                  />
                )}

                <IconButton color="error" onClick={() => handleRemoveAction(rule.id, aIndex)}>
                  <Delete />
                </IconButton>
              </Stack>
            ))}

            <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleAddAction(rule.id)}>
              + Add Action
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
