import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { RiChat1Fill, RiCloseCircleFill } from "react-icons/ri";
import { SiGoogleassistant } from "react-icons/si";
import useAuth from './useAuth';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

type Message = {
    content: string;
    role: 'user' | 'assistant';
};

type ChatWindowProps = {
    onClose: () => void;
    messages: Message[];
    sendMessage: () => void;
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, messages, sendMessage, input, setInput }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null); // Reference for scrolling

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-20 right-5 w-1/3 h-1/2 border border-gray-300 rounded-3xl bg-white shadow-lg flex flex-col">
            <div className="flex justify-between items-center bg-neutral text-white p-3 rounded-t-3xl">
                <span className="text-xl flex items-center gap-4"><SiGoogleassistant /> Assistant</span>
                <RiCloseCircleFill onClick={onClose} className="text-white text-xl font-bold cursor-pointer" />
            </div>
            <div className="flex-1 p-4 overflow-y-auto text-sm">
                <div className="p-4 text-lg text-center flex flex-col items-center gap-4 font-bold">
                    <SiGoogleassistant className='text-4xl' />
                    <p>Hi there! How can I help you today?</p>
                </div>
                {messages.map((msg, index) => (
                    <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                        <p className={`inline-block ${msg.role === 'user' ? 'bg-neutral text-white' : 'bg-gray-200'} p-4 rounded-2xl max-w-80`}>
                            <ReactMarkdown>
                                {msg.content}
                            </ReactMarkdown>
                        </p>
                        {msg.role === 'user' && <SiGoogleassistant />}
                    </div>
                ))}
                {/* This empty div ensures scrolling goes to the latest message */}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center p-3 border-gray-200">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    className="flex-1 p-4 border border-gray-300 rounded-full text-sm"
                />
                <button onClick={sendMessage} className="ml-2 p-4 bg-neutral text-white rounded-full text-sm">
                    Send
                </button>
            </div>
        </div>
    );
};

const ChatAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const { user, loading } = useAuth();
    const [chatHeader, setChatHeader] = useState<any>();

    const getCandidateProfile = () => {
        axios.get(`http://localhost:8000/candidates/userId/${user.id}`)
            .then((response) => {
                setChatHeader([
                    { content: `I'm ${response.data.data[0].user.fullname}`, role: 'user' },
                    { content: `Here is my profile data: ${JSON.stringify(response.data.data[0])}`, role: 'user' },
                ]);
            })
            .catch((error) => { });
    }

    const getRecruiterProfile = () => {
        axios.get(`http://localhost:8000/recruiter/userId/${user.id}`)
            .then((response) => {
                setChatHeader([
                    { content: `I'm ${response.data.data[0].user.fullname}`, role: 'user' },
                    { content: `Here is my profile data: ${JSON.stringify(response.data.data[0])}`, role: 'user' },
                ]);
            })
            .catch((error) => { });
    }

    useEffect(() => {
        if (!loading) {
            if (user.userType === 'Candidate') {
                getCandidateProfile();
            } else if (user.userType === 'Recruiter') {
                getRecruiterProfile();
            }
        }
    }, [loading]);

    const getAssistantResponse = async () => {
        await axios.post('http://localhost:8000/assistant/', {
            messages: [
                ...chatHeader,
                ...messages,
                { content: input, role: 'user' }
            ]
        }).then((response: any) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: response.data.response, role: 'assistant' },
            ]);
        }).catch((error) => {});
    }

    const sendMessage = (): void => {
        if (input.trim()) {
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: input, role: 'user' },
            ]);
            setInput("");

            getAssistantResponse();
        }
    };

    const toggleChat = (): void => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            {!isOpen ? (
                <button onClick={toggleChat} className="fixed bottom-5 right-5 p-4 bg-neutral text-white rounded-full text-4xl">
                    <RiChat1Fill />
                </button>
            ) : (
                <ChatWindow
                    onClose={toggleChat}
                    messages={messages}
                    sendMessage={sendMessage}
                    input={input}
                    setInput={setInput}
                />
            )}
        </div>
    );
};

export default ChatAssistant;
