import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({ boxes, imageUrl }) => {
	return (
		<div className='center ma'>
			<div className = 'absolute mt2'>
				<img id='inputImage' alt = '' src = {imageUrl} width ='500px' height = 'auto'/>
				{	Object.keys(boxes).map( (item,i) => { 
					return(<div className='bounding-box' 
								key={i} 
								style={{top: boxes[item].topRow,
										right: boxes[item].rightCol,
										bottom: boxes[item].bottomRow,
										left: boxes[item].leftCol}}
							/>)
				})
			}
			</div>

		</div>
	);
}

export default FaceRecognition;