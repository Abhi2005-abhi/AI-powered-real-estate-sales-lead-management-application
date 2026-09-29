import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import AddLead from './pages/AddLead';
import LeadDetails from './pages/LeadDetails';
import FollowUp from './pages/FollowUp';

function App() {
    return (
        <Router>
            <div className="flex h-screen bg-slate-50">
                <Sidebar className="w-64 flex-shrink-0 border-r border-slate-200" />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header className="h-16 flex-shrink-0" />
                    <main className="flex-1 overflow-auto p-4 md:p-8">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/add-lead" element={<AddLead />} />
                            <Route path="/leads/:id" element={<LeadDetails />} />
                            <Route path="/follow-up" element={<FollowUp />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
