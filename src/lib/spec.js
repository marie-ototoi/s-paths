export default {
    "$schema": "https://vega.github.io/schema/vega/v3.json",
    "width": 10,
    "height": 10,
    "autosize": "none",
    "padding": 0,
    "signals": [
        {
            "name": "endZone",
            "init": true,
            "on": [
                {
                    "events": "mouseup",
                    "update": "true"
                },
                {
                    "events": "mousedown",
                    "update": "false"
                }
            ]
        },
        {
            "name": "zone",
            "init": null,
            "on": [
                {
                    "events": "[mousedown, mouseup] > mousemove{100}",
                    "update": "zone ? [zone[0], [x(), y()]] : [[0, 0],[0, 0]]"
                },
                {
                    "events": "mousedown",
                    "update": "[[x(), y()], [x(), y()]]"
                },
                {
                    "events": "mouseup",
                    "update": "null"
                }
            ]
        }
    ],
    "data": [],
    "scales": [],
    "projections": [],
    "marks": [
        {
            "type": "rect",
            "interactive": false,
            "encode": {
                "enter": {
                    "y": {"value": 0},
                    "fill": {"value": "#ddd"}
                },
                "update": {
                    "x": {"signal": "zone ? zone[0][0] : 0"},
                    "x2": {"signal": "zone ? zone[1][0] : 0"},
                    "y": {"signal": "zone ? zone[0][1] : 0"},
                    "y2": {"signal": "zone ? zone[1][1] : 0"},
                    "fillOpacity": {"signal": "zone ? 0.2 : 0"}
                }
            }
        },
        {
            "type": "rect",
            "interactive": false,
            "encode": {
                "enter": {
                    "width": {"value": 1},
                    "fill": {"value": "#666"}
                },
                "update": {
                    "fillOpacity": {"signal": "zone ? 1 : 0"},
                    "x": {"signal": "zone ? zone[0][0] : 0"},
                    "y": {"signal": "zone ? zone[0][1] : 0"},
                    "y2": {"signal": "zone ? zone[1][1] : 0"},
                }
            }
        },
        {
            "type": "rect",
            "interactive": false,
            "encode": {
                "enter":{
                    "y": {"value": 0},
                    "width": {"value": 1},
                    "fill": {"value": "#666"}
                },
                "update": {
                    "fillOpacity": {"signal": "zone ? 1 : 0"},
                    "x": {"signal": "zone ? zone[1][0] : 0"},
                    "y": {"signal": "zone ? zone[0][1] : 0"},
                    "y2": {"signal": "zone ? zone[1][1] : 0"},
                }
            }
        },
        {
            "type": "rect",
            "interactive": false,
            "encode": {
                "enter":{
                    "y": {"value": 0},
                    "height": {"value": 1},
                    "fill": {"value": "#666"}
                },
                "update": {
                    "fillOpacity": {"signal": "zone ? 1 : 0"},
                    "x": {"signal": "zone ? zone[0][0] : 0"},
                    "x2": {"signal": "zone ? zone[1][0] : 0"},
                    "y": {"signal": "zone ? zone[0][1] : 0"},
                }
            }
        },
        {
            "type": "rect",
            "interactive": false,
            "encode": {
                "enter":{
                    "y": {"value": 0},
                    "height": {"value": 1},
                    "fill": {"value": "#666"}
                },
                "update": {
                    "fillOpacity": {"signal": "zone ? 1 : 0"},
                    "x": {"signal": "zone ? zone[0][0] : 0"},
                    "x2": {"signal": "zone ? zone[1][0] : 0"},
                    "y": {"signal": "zone ? zone[1][1] : 0"},
                }
            }
        }
    ]
}
