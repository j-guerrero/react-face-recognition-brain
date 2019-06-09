import React from 'react'
import './FaceRecognition.css'

const FaceRecognition = ({ box, imageUrl }) => {
	return (
		<div className='center ma'>
			<div className = 'absolute mt2'>
				<img id='inputImage' alt = '' src = {imageUrl} width ='500px' height = 'auto'/>
				{	Object.keys(box).map(item => { 
					return(<div className='bounding-box' style={{top: box[item].topRow,right: box[item].rightCol,bottom: box[item].bottomRow,left: box[item].leftCol}} />)
				})
			}
			</div>

		</div>
	);
}

export default FaceRecognition;