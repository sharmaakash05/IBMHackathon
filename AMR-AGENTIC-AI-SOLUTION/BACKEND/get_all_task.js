const fs = require('fs');
const path = require('path');

exports.getAllTaskNames = (req, res) => {
    try {
        const filePath = path.join(__dirname, 'tasks.json');
        let tasks = [];
        if (fs.existsSync(filePath)) {
            tasks = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        // Extract all taskName values
        const taskNames = tasks
            .filter(task => task.taskName) // Only tasks with a taskName property
            .map(task => task.taskName);

        res.json({ taskNames });
    } catch (error) {
        console.error('Error reading tasks.json:', error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};