'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Libre_Baskerville } from 'next/font/google';

// components
import Loader from './Loader';

// libs
import { Mistral } from '@mistralai/mistralai';
import Markdown from 'react-markdown';

// init mistral ai
const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

// google font
const libreBaskerville = Libre_Baskerville({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
})

export default function Chat() {

	const [messages, setMessages] = useState([]);
	const [userQuestion, setUserQuestion] = useState('');
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
		if (userQuestion.trim() === '') return;
			// add user question
			// @ts-ignore
			setMessages((prevMessages) => [...prevMessages, { user: userQuestion, ai: '' } ]);
			setUserQuestion('');
		
			const chatAi = async () => {
				const chatResponse = await client.chat.complete({
					model: 'mistral-large-latest',
					messages: [{ role: 'user', content: userQuestion }],
				});
				// @ts-ignore
				return chatResponse.choices[0].message.content;
			};
		
			const aiResponse = await chatAi();
		
			// update last message with ai response
			// @ts-ignore
			setMessages((prevMessages) => prevMessages.map((message, index) => index === prevMessages.length - 1 ? { ...message, ai: aiResponse } : message ));
		}

	return (
		<div className='h-dvh bg-[#F0EEE6] flex flex-col justify-center items-center py-3'>
			<h1 className={`md:text-6xl text-4xl text-black ${libreBaskerville.className}`}>RobIA</h1>
			{/* chatbox */}
			<div ref={chatboxRef} className='w-full max-w-screen-lg h-full flex flex-col overflow-auto p-2'>
				{messages.map((message: any, index) => (
					<div key={index}>
						<p className='bg-[#E5E3D9] justify-self-end mb-2 message-bubble'>{message.user}</p>
						{message.ai ? (
							<div className='bg-[#FAF9F7] justify-self-start message-bubble'><Markdown>{message.ai}</Markdown></div>
						) : (
							// loader
							<Loader />
						)}
						<br />
					</div>
				))}
			</div>
			{/* textbox */}
			<div className="mt-auto flex w-full max-w-screen-lg p-2 rounded">
				<input
					type="text"
					value={userQuestion}
					onChange={handleChange}
					onKeyDown={(e) => e.key === "Enter" && handleMessage()}
					className="w-4/5 p-2 border rounded-l-lg text-black"
				/>
				<input
					type="button"
					value="Envoyer"
					onClick={handleMessage}
					className="w-1/5 rounded-r-lg bg-[#d97757] font-bold text-white cursor-pointer"
				/>
			</div>
		</div>
	);
}
