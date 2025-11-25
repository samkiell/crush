import React from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-base-100 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
                            Get in touch
                        </h1>
                        <p className="text-lg text-base-content/70 mb-12">
                            Have questions about our platform? We're here to help. Chat with our friendly team.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-base-content mb-1">Email</h3>
                                    <p className="text-base-content/70">Our friendly team is here to help.</p>
                                    <a href="mailto:crusheduplaceintl@gmail.com" className="text-primary font-medium hover:underline">crusheduplaceintl@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-secondary/10 rounded-lg text-secondary">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-base-content mb-1">Office</h3>
                                    <p className="text-base-content/70">Come say hello at our office HQ.</p>
                                    <p className="text-base-content/70">Oduduwa Estate, Ile-Ife, Osun State</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-accent/10 rounded-lg text-accent">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-base-content mb-1">Phone</h3>
                                    <p className="text-base-content/70">Mon-Fri from 8am to 5pm.</p>
                                    <a href="tel:+2348030740550" className="text-primary font-medium hover:underline">+234 803 074 0550</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-base-200 p-8 rounded-3xl shadow-lg">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">First Name</span>
                                    </label>
                                    <input type="text" placeholder="First name" className="input input-bordered w-full" />
                                </div>
                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-medium">Last Name</span>
                                    </label>
                                    <input type="text" placeholder="Last name" className="input input-bordered w-full" />
                                </div>
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Email</span>
                                </label>
                                <input type="email" placeholder="you@company.com" className="input input-bordered w-full" />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium">Message</span>
                                </label>
                                <textarea className="textarea textarea-bordered h-32" placeholder="Leave us a message..."></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-full text-lg">
                                Send Message
                                <Send className="w-5 h-5 ml-2" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
