exports.getRobotState = (req, res) => {
  res.json({
    "customerId": "virya",
    "vehicleId": "226e8",
    "payload": {
      "battery_soc": 26,
      "brake_status": "VLP_OBS,Localization,Heart_Beat",
      "cart_status": 1,
      "emg_status": 0,
      "gcart_status": null,
      "localization_status": true,
      "mapName": "viryaMap",
      "narrowPath": null,
      "ndt_pose": {
        "orientation": {
          "w": 0.3685848632830441,
          "x": -0.10161127209190518,
          "y": 0.03817725844827523,
          "z": 0.9232349889816016
        },
        "position": {
          "x": -22.241914749145508,
          "y": -79.11270141601562,
          "z": -3.169316053390503
        }
      },
      "nodeStates": [
        {
          "actions": [
            {
              "actionId": "navigate",
              "actionType": "navigation",
              "parameters": {
                "targetLocation": "FMS_Location_1"
              },
              "sequence_number": 1,
              "state": "completed",
              "timestamp": "2025-09-04 15:30:26"
            }
          ],
          "nodeId": "U1",
          "orientation": {
            "w": 0.9997834450096179,
            "x": -0.0011514769441499885,
            "y": -0.0135711843426165,
            "z": -0.01573404401563612
          },
          "position": {
            "x": 4.593762397766113,
            "y": -3.7141847610473633,
            "z": 0.14453381299972534
          },
          "released": true,
          "sequenceId": 0,
          "state": "completed"
        }
      ],
      "pathName": null,
      "path_data": {
        "available": false,
        "count": 0,
        "frame_id": null,
        "orientations": [],
        "positions": []
      },
      "sequence_status": "completed",
      "taskInstanceId": "8e2dadaf-b17d-4262-a1b2-8acd267055b3",
      "taskName": "Test ",
      "timestamp": "2025-09-05T09:09:18.237593",
      "vehicle_alerts": null,
      "waypoint_obstacle_checking": false
    }
  });
};