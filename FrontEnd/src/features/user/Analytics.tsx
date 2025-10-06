import React from 'react';
import TestIntegrateAPI from './notes/TestIntegrateAPI';

const Analytics: React.FC = () => {
    return (
        <div className="w-full overflow-y-auto p-5">
            <h1>Progress & Analytics</h1>
            <p>This page shows your learning progress and analytics.</p>

            <div className="max-h-[80vh] overflow-y-auto border rounded-lg p-4 mt-4">
                <TestIntegrateAPI />
            </div>
        </div>
    );
};

export default Analytics;
