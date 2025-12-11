const fs = require('fs');
const path = require('path');

exports.summonVehicle = async (req, res) => {
    try {
        const { taskName, customerId } = req.body;

        // Simulate finding the task and assigning a vehicle
        if (!taskName || !customerId) {
            return res.status(400).json({ message: "Missing taskName or customerId" });
        }

        // Simulate a delay for assignment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Dummy assigned vehicle
        const assignedVehicle = "VEHICLE123";
        const assignedAt = new Date().toISOString();

        // Prepare execution record
        const execution = {
            message: `Vehicle assigned successfully.`,
            assignedVehicle,
            taskName,
            customerId,
            assignedAt,
            status: "Initiated"
        };

        // Save execution to executions.json
        const filePath = path.join(__dirname, 'executions.json');
        let executions = [];
        if (fs.existsSync(filePath)) {
            executions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        executions.push(execution);
        fs.writeFileSync(filePath, JSON.stringify(executions, null, 2));

        res.status(201).json(execution);
    } catch (error) {
        console.error('Error in dummy summonVehicle:', error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};