'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Libre_Baskerville } from 'next/font/google';

// components
import Loader from './Loader';
import Textbox from './Textbox';

// libs
import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";


// google font
const libreBaskerville = Libre_Baskerville({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
})

// types
type Message = {
	user: string;
	ai: string | undefined;
}

export default function Chat() {

	const [messages, setMessages] = useState<Message[]>([]);
	const [userQuestion, setUserQuestion] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const chatboxRef = useRef<HTMLDivElement>(null);

	// auto scroll to bottom when new message is displayed
	useEffect(() => {
		if (chatboxRef.current) {
			chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
		}
	}, [messages]);


	const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
		setUserQuestion(e.target.value);
	}

	
	const handleMessage = async () => {
		const question = userQuestion.trim();

		if (!question || isLoading) return;

		const messageIndex = messages.length;

		setIsLoading(true);
		setUserQuestion('');

		setMessages((prevMessages) => [
			...prevMessages,
			{ user: question, ai: undefined },
		]);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ question }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur API Groq');
			}

			setMessages((prevMessages) =>
				prevMessages.map((message, index) =>
					index === messageIndex
						? { ...message, ai: data.answer }
						: message
				)
			);
		
		} catch (error) {
			console.error('Erreur groq :', error);

			const message = error instanceof Error ? error.message : 'Erreur inconnue';

			setMessages((prevMessages) =>
				prevMessages.map((item, index) =>
					index === messageIndex
						? { ...item, ai: `❌ ${message}` }
						: item
				)
			);
		} finally {
			setIsLoading(false);
		}

	};

	return (
		<div className='h-dvh bg-[#F0EEE6] flex flex-col justify-between items-center py-3'>
			<h1 className={`md:text-6xl text-4xl text-black ${libreBaskerville.className}`}>RobIA</h1>

			{/* chatbox */}
			<div ref={chatboxRef} className='w-full max-w-screen-lg flex flex-grow flex-col overflow-auto p-2'>
				{messages.map((message: Message, index: number) => (
					<div key={index}>
						<p className='bg-[#E5E3D9] justify-self-end mb-2 message-bubble'>{message.user}</p>
						{message.ai !== undefined ? (
							<div className='bg-[#FAF9F7] justify-self-start message-bubble space-y-2'>
								{/* @ts-ignore */}
								<Markdown remarkPlugins={[remarkGfm]}>{message.ai ?? ''}</Markdown>
							</div>
						) : (
							// loader
							<Loader />
						)}
						<br />
					</div>
				))}
			</div>

			{/* textbox */}
			<Textbox 
				userValue={userQuestion}
				onChange={handleChange}
				onKeyDown={(e) => e.key === "Enter" && !isLoading && handleMessage()}
				onClick={() => !isLoading && handleMessage()}
			/>
		</div>
	);
}
