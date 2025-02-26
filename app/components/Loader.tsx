import React from 'react';

function Loader() {
	return (
		<div className='flex space-x-2 mt-4'>
			<div className="dot-loading"></div>
			<div className="dot-loading"></div>
			<div className="dot-loading"></div>
		</div>
	);
}

export default Loader;