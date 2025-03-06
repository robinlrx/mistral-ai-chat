import React from 'react';

type TextboxProps = {
	userValue: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}

const Textbox = ({userValue, onChange, onKeyDown, onClick}: TextboxProps) => {
	return (
		<div className="flex w-full max-w-screen-lg p-2 rounded">
			<input
				type="text"
				value={userValue}
				onChange={onChange}
				onKeyDown={onKeyDown}
				className="w-4/5 p-2 border rounded-l-lg text-black"
			/>
			<input
				type="button"
				value="Envoyer"
				onClick={onClick}
				className="w-1/5 rounded-r-lg bg-[#d97757] font-bold text-white cursor-pointer"
			/>
		</div>
	);
}

export default Textbox;