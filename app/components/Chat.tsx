'use client';
import React, { useState } from 'react';
import { Mistral } from '@mistralai/mistralai';

// init mistral ai
const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

export default function Chat() {

	const [messages, setMessages] = useState([]);
	const [userQuestion, setUserQuestion] = useState('');
	const [loader, setLoader] = useState(false);


	const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
		setUserQuestion(e.target.value);
	}

	const handleMessage = async () => {
		if (userQuestion.trim() === '') return;
		setLoader(true)
		const chatAi = async () => {
			const chatResponse = await client.chat.complete({
				model: 'mistral-large-latest',
				messages: [{role: 'user', content: userQuestion}],
			});
			// @ts-ignore
			return chatResponse.choices[0].message.content;
		};

		const aiResponse = await chatAi();
		setLoader(false);
		// @ts-ignore
		setMessages([ ...messages, { user: userQuestion, ai: aiResponse } ]);
		setUserQuestion('');
	}

	return (
		<div className='h-full bg-neutral-100 flex flex-col justify-center items-center py-3'>
			<h1 className='text-6xl'>Le Chat AI de Robin</h1>
			{/* chatbox */}
			<div className='w-full max-w-screen-lg h-full flex flex-col overflow-auto p-4'>
				{messages.map((message: any, index) => (
					<div key={index}>
						<p className='p-4 bg-amber-400 rounded-xl justify-self-end max-w-2xl mb-2'>{message.user}</p>
						<p className='p-4 bg-orange-400 rounded-xl justify-self-start max-w-2xl'>{message.ai}</p>
						<br />
					</div>
				))}
			</div>
			{/* loader */}
			{loader && <h2 className='animate-pulse'>Chargement de la réponse...</h2>}
			{/* textbox */}
			<div className="mt-auto flex w-full max-w-screen-lg p-2 m-4 rounded">
				<input
					type="text"
					value={userQuestion}
					onChange={handleChange}
					className="w-4/5 p-2 border rounded-l-lg"
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