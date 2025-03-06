'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Libre_Baskerville } from 'next/font/google';

// components
import Loader from './Loader';
import Textbox from './Textbox';

// libs
import { Mistral } from '@mistralai/mistralai';
import Markdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { ContentChunk } from '@mistralai/mistralai/models/components';

// init mistral ai
const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

// google font
const libreBaskerville = Libre_Baskerville({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
})

// types
type Message = {
	user: string;
	ai: string | ContentChunk[] | undefined;
}

export default function Chat() {

	const [messages, setMessages] = useState<Message[]>([]);
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
			setMessages((prevMessages: Message[]) => [...prevMessages, { user: userQuestion, ai: '' } ]);
			setUserQuestion('');
		
			const chatAi = async () => {
				const chatResponse = await client.chat.complete({
					model: 'mistral-large-latest',
					messages: [{ role: 'user', content: userQuestion }],
				});

				if (chatResponse && chatResponse.choices && chatResponse.choices.length > 0) return chatResponse.choices[0].message?.content || 'No content available';
				
			};
		
			const aiResponse = await chatAi();
		
			// update last message with ai response
			setMessages((prevMessages: Message[]) => prevMessages.map((message, index) => index === prevMessages.length - 1 ? { ...message, ai: aiResponse } : message ));
		}

	return (
		<div className='h-dvh bg-[#F0EEE6] flex flex-col justify-center items-center py-3'>
			<h1 className={`md:text-6xl text-4xl text-black ${libreBaskerville.className}`}>RobIA</h1>

			{/* chatbox */}
			<div ref={chatboxRef} className='w-full max-w-screen-lg h-full flex flex-col overflow-auto p-2'>
				{messages.map((message: Message, index: number) => (
					<div key={index}>
						<p className='bg-[#E5E3D9] justify-self-end mb-2 message-bubble'>{message.user}</p>
						{message.ai ? (
							<div className='bg-[#FAF9F7] justify-self-start message-bubble space-y-2'>
								{/* @ts-ignore */}
								<Markdown remarkPlugins={[remarkGfm]}>{message.ai}</Markdown>
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
				onKeyDown={(e) => e.key === "Enter" && handleMessage()}
				onClick={handleMessage}
			/>
		</div>
	);
}
