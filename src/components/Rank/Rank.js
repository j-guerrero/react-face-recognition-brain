import React from 'react'

const Rank = ({name, entries}) => {
	return (
		<div>
			<div className = 'near-black f3'>
				{`${name}, the number of photos you've submitted overall is...`}
			</div>
			<div className = 'blue f1'>
				{entries}
			</div>
		</div>
	);
}

export default Rank;