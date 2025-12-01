'use client';

import { useState } from 'react';
import StudyMaterialCard from '@/components/study/StudyMaterialCard';
import TopicNavigation from '@/components/study/TopicNavigation';

// Mock Data
const MOCK_TOPICS = [
    { id: '1', title: 'Introduction to Biology', duration: '15 min', completed: true, locked: false },
    { id: '2', title: 'Cell Structure and Function', duration: '25 min', completed: false, locked: false },
    { id: '3', title: 'Photosynthesis', duration: '30 min', completed: false, locked: true },
    { id: '4', title: 'Genetics and Heredity', duration: '45 min', completed: false, locked: true },
    { id: '5', title: 'Ecology and Ecosystems', duration: '20 min', completed: false, locked: true },
];

const MOCK_CONTENT = {
    '1': {
        title: 'Introduction to Biology',
        content: `Biology is the scientific study of life. It is a natural science with a broad scope but has several unifying themes that tie it together as a single, coherent field. For instance, all organisms are made up of cells that process hereditary information encoded in genes, which can be transmitted to future generations.

Another major theme is evolution, which explains the unity and diversity of life. Energy processing is also important to life as it allows organisms to move, grow, and reproduce. Finally, all organisms are able to regulate their own internal environments.

Biologists are able to study life at multiple levels of organization, from the molecular biology of a cell to the anatomy and physiology of plants and animals, and evolution of populations. Hence, there are multiple subdisciplines within biology, each defined by the nature of their research questions and the tools that they use.`,
        progress: 100
    },
    '2': {
        title: 'Cell Structure and Function',
        content: `The cell is the basic structural, functional, and biological unit of all known organisms. A cell is the smallest unit of life. Cells are often called the "building blocks of life". The study of cells is called cell biology, cellular biology, or cytology.

Cells consist of cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids. Most plant and animal cells are only visible under a light microscope, with dimensions between 1 and 100 micrometers.

Electron microscopy gives a much higher resolution showing greatly detailed cell structure. Organisms can be classified as unicellular (consisting of a single cell such as bacteria) or multicellular (including plants and animals). Most unicellular organisms are classified as microorganisms.`,
        progress: 45
    }
};

export default function StudyPage() {
    const [currentTopicId, setCurrentTopicId] = useState('2');
    const [topics, setTopics] = useState(MOCK_TOPICS);

    const handleTopicSelect = (topicId) => {
        setCurrentTopicId(topicId);
    };

    const handleComplete = () => {
        // Update progress logic here
        const updatedTopics = topics.map(t =>
            t.id === currentTopicId ? { ...t, completed: true } : t
        );
        setTopics(updatedTopics);

        // Unlock next topic logic could go here
    };

    const currentContent = MOCK_CONTENT[currentTopicId] || {
        title: 'Content Locked',
        content: 'Please complete the previous modules to unlock this content.',
        progress: 0
    };

    return (
        <div className="min-h-screen bg-base-200/50 pb-20 md:pb-8 pt-6">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Navigation Sidebar */}
                    <div className="lg:w-80 shrink-0">
                        <TopicNavigation
                            topics={topics}
                            currentTopicId={currentTopicId}
                            onSelectTopic={handleTopicSelect}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <StudyMaterialCard
                            title={currentContent.title}
                            content={currentContent.content}
                            progress={currentContent.progress}
                            onComplete={handleComplete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
