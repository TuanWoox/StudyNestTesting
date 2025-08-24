import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="">
            {/* Tiêu đề + mô tả */}
            <p className=" mb-6">Welcome back! Here’s an overview of your system.</p>

            {/* Thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Card 1 */}
                <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Users</h2>
                    <p className="text-3xl font-bold text-green-600">1,245</p>
                    <p className="text-sm text-gray-400">Active this month</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Feedback</h2>
                    <p className="text-3xl font-bold text-blue-600">320</p>
                    <p className="text-sm text-gray-400">New this week</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h2>
                    <p className="text-3xl font-bold text-purple-600">$4,560</p>
                    <p className="text-sm text-gray-400">This month</p>
                </div>
            </div>

            {/* Biểu đồ / danh sách */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Placeholder */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">User Growth</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400">
                        {/* Chỗ này bạn có thể nhúng biểu đồ thực (Recharts, Chart.js) */}
                        Chart Placeholder
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity</h3>
                    <ul className="space-y-3">
                        <li className="text-gray-600 text-sm">✔ User JohnDoe registered.</li>
                        <li className="text-gray-600 text-sm">✔ Feedback submitted by Alice.</li>
                        <li className="text-gray-600 text-sm">✔ System updated successfully.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
