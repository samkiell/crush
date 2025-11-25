import React from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "What is D2C?",
            answer: "D2C (Devour To Crush) is a comprehensive JAMB exam preparation platform designed to help students ace their exams through practice questions, mock exams, and performance tracking."
        },
        {
            question: "Is D2C free to use?",
            answer: "We offer both free and premium plans. The free plan gives you access to a limited number of questions and features, while the premium plan unlocks full access to our entire question bank and advanced analytics."
        },
        {
            question: "How do I reset my password?",
            answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password."
        },
        {
            question: "Can I use D2C on my mobile phone?",
            answer: "Yes! D2C is fully responsive and works great on all mobile devices. You can also install it as a PWA for an app-like experience."
        },
        {
            question: "How are the mock exams structured?",
            answer: "Our mock exams are designed to simulate the actual JAMB exam environment, including the time limit and question format, to give you the best possible preparation."
        }
    ];

    return (
        <div className="min-h-screen bg-base-100 pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg text-base-content/70">
                        Everything you need to know about D2C.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="collapse collapse-plus bg-base-200 rounded-xl">
                            <input type="radio" name="my-accordion-3" defaultChecked={index === 0} />
                            <div className="collapse-title text-xl font-medium text-base-content">
                                {faq.question}
                            </div>
                            <div className="collapse-content text-base-content/70">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <p className="text-base-content/70 mb-4">Still have questions?</p>
                    <a href="/contact" className="btn btn-outline btn-primary">Contact Support</a>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
