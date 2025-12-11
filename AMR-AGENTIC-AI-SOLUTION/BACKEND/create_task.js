const fs = require('fs');
const path = require('path');

exports.addTask = async (req, res) => {
    try {
        const { order, customerId, taskName, vehicleIds, mapName, priority } = req.body;
        const mandatoryFields = ['order', 'customerId', 'priority', 'mapName'];
        const missingFields = mandatoryFields.filter(field => !req.body[field]);
        const validPriorities = ['high', 'medium', 'normal'];
        if (!validPriorities.includes(priority)) {
            missingFields.push(`Invalid priority value. Allowed values are: ${validPriorities.join(', ')}`);
        }
        if (!order?.nodes?.length) {
            missingFields.push('Order must have at least one node');
        }
        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Validation error(s): ${missingFields.join(', ')}` });
        }

        // Load existing tasks
        const filePath = path.join(__dirname, 'tasks.json');
        let tasks = [];
        if (fs.existsSync(filePath)) {
            tasks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Check for duplicate taskName
        if (tasks.some(task => task.taskName === taskName)) {
            return res.status(409).json({ message: 'Task already exists' });
        }

        // Assign a simple taskId and timestamp
        const taskId = `POC${tasks.length + 1}`;
        const timestamp = new Date().toISOString();

        // Create the task object
        const task = {
            taskId,
            taskName,
            customerId,
            mapName,
            priority,
            vehicleIds,
            order,
            status: 'pending',
            createdAt: timestamp
        };

        // Save the new task
        tasks.push(task);
        fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

        res.status(201).json({
            message: 'Task added successfully',
            result: task
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};