'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Mistral } from '@mistralai/mistralai';
import Loader from './Loader';

// init mistral ai
const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

export default function Chat() {

	const [messages, setMessages] = useState([]);
	const [userQuestion, setUserQuestion] = useState('');
	const chatboxRef = useRef<HTMLDivElement>(null);

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
			// Ajouter immédiatement la question de l'utilisateur
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
		
			// Mettre à jour le dernier message avec la réponse de l'IA
			// @ts-ignore
			setMessages((prevMessages) => prevMessages.map((message, index) => index === prevMessages.length - 1 ? { ...message, ai: aiResponse } : message ));
		}

	return (
		<div className='h-full bg-neutral-100 flex flex-col justify-center items-center py-3'>
			<h1 className='md:text-6xl text-4xl text-black'>RobIA</h1>
			{/* chatbox */}
			<div ref={chatboxRef} className='w-full max-w-screen-lg h-full flex flex-col overflow-auto p-4'>
				{messages.map((message: any, index) => (
					<div key={index}>
						<p className='p-4 bg-red-300 rounded-xl justify-self-end max-w-2xl mb-2 text-black'>{message.user}</p>
						{message.ai ? (
							<p className='p-4 bg-orange-300 rounded-xl justify-self-start max-w-2xl text-black'>{message.ai}</p>
						) : (
							// loader
							<Loader />
						)}
						<br />
					</div>
				))}
			</div>
			{/* textbox */}
			<div className="mt-auto flex w-full max-w-screen-lg p-2 m-4 rounded">
				<input
					type="text"
					value={userQuestion}
					onChange={handleChange}
					className="w-4/5 p-2 border rounded-l-lg text-black"
				/>
				<input
					type="button"
					value="Envoyer"
					onClick={handleMessage}
					className="w-1/5 rounded-r-lg bg-sky-500 font-bold text-white cursor-pointer"
				/>
			</div>
		</div>
	);
}