import React from 'react';

function Loader() {
	return (
		<div className='flex space-x-2 mt-4'>
			<div className="size-3 rounded-full bg-neutral-300 animate-bounce"></div>
			<div className="size-3 rounded-full bg-neutral-300 animate-bounce"></div>
			<div className="size-3 rounded-full bg-neutral-300 animate-bounce"></div>
		</div>
	);
}

export default Loader;