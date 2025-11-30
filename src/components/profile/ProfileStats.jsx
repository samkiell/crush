import { motion } from 'framer-motion';
import { BookOpen, Trophy, PenTool, Award } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm flex items-center gap-4"
    >
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-2xl font-bold text-base-content">{value}</p>
            <p className="text-sm text-base-content/60">{label}</p>
        </div>
    </motion.div>
);

export default function ProfileStats({ stats }) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
                icon={PenTool}
                label="Posts"
                value={stats.postsCount || 0}
                color="bg-blue-500"
            />
            <StatCard
                icon={BookOpen}
                label="Exams Taken"
                value={stats.examsTaken || 0}
                color="bg-green-500"
            />
            <StatCard
                icon={Trophy}
                label="Avg. Score"
                value={`${stats.averageScore || 0}%`}
                color="bg-yellow-500"
            />
            <StatCard
                icon={Award}
                label="Reputation"
                value={stats.reputation || 0} // Assuming reputation is passed in stats or user object
                color="bg-purple-500"
            />
        </div>
    );
}
