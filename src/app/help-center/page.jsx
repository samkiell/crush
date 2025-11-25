import React from 'react';
import { Search, Book, MessageCircle, FileText, Shield } from 'lucide-react';

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-base-100 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
                        How can we help you?
                    </h1>
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="input input-bordered input-lg w-full pl-12 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-base-content/50" />
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
                        <div className="card-body">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Book className="w-6 h-6" />
                                </div>
                                <h2 className="card-title text-base-content">Getting Started</h2>
                            </div>
                            <p className="text-base-content/70">Learn the basics of using D2C, setting up your account, and starting your first exam.</p>
                        </div>
                    </div>

                    <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
                        <div className="card-body">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="card-title text-base-content">Exams & Practice</h2>
                            </div>
                            <p className="text-base-content/70">Everything you need to know about taking exams, reviewing results, and tracking progress.</p>
                        </div>
                    </div>

                    <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
                        <div className="card-body">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-accent/10 rounded-lg text-accent">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h2 className="card-title text-base-content">Account & Security</h2>
                            </div>
                            <p className="text-base-content/70">Manage your profile, password, and security settings.</p>
                        </div>
                    </div>

                    <div className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer">
                        <div className="card-body">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-info/10 rounded-lg text-info">
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <h2 className="card-title text-base-content">Billing & Subscriptions</h2>
                            </div>
                            <p className="text-base-content/70">Information about plans, payments, and subscription management.</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Teaser */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-base-content mb-4">Still need help?</h3>
                    <p className="text-base-content/70 mb-8">Can't find what you're looking for? Our support team is here to help.</p>
                    <a href="/contact" className="btn btn-primary px-8">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
