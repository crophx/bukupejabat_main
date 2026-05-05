import axios from "axios";

export const logActivity = async (action, description) => {
    try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        await axios.post("http://127.0.0.1:8000/api/activity-logs", {
            user_id: userId,
            action: action,
            description: description
        });
    } catch (error) {
        console.error("Gagal mencatat log aktivitas:", error);
    }
};
