import './App.css';
import React from "react";
import { useRef, useState, useEffect } from "react";
import Noise from './noise.js';
import MyNoise from './noise.js';

function App() {

	const canvasRef = useRef(null);

	const [value, setValue] = useState(50);
	const [seed, setSeed] = useState(1);
	const [octaves, setOctaves] = useState(1);
	const [zoom, setZoom] = useState(100);
	const [colored, setColored] = useState(false);

	
	useEffect(() => {
		let noise = new Noise(seed);
		//setInterval('t()',20);
		generateMap(noise)
	}, [])
	
	const getGradient = (v) => {
		return v * 255;
	}
	
	const generateMap = (noise) => {
		for (let y = 0; y < 600; y++) {
			for (let x = 0; x < 600; x++) {
				drawPixel(x, y, noise);
			}
		}
	}

	const drawPixel = (x, y, noise) => {
		const ctx = canvasRef.current.getContext('2d');

		let v = getOctaves(x, y, zoom, 1, noise)

		v = Math.max(0, Math.min(v, 1));
	
		ctx.fillStyle = 'red';

		let color = 'red';

		if(colored){
			color = getColor(v)
		} else {
			color = `rgb(${getGradient(v)}, ${getGradient(v)}, ${getGradient(v)})`
		}

		ctx.fillStyle = color;
	
		ctx.fillRect(x, y, 1, 1);
	}

	const getOctaves = (x, y, zoom, baseFalloff, noise) => {


		let octavesArr = []
		let falloff = baseFalloff;
	
		for(let i = 1; i <= octaves; i++){
			let v = noise.perlin2(x / (zoom/(i*i)), y /  (zoom/(i*i)));
			v = ((v - 0.5) + 1) / 2
			v = v * falloff;
	
			octavesArr.push(v);
			falloff *= 0.5;
		}
	
		let v = 0;
		octavesArr.forEach(octave => {
			v += octave
		});
		
		return v;
	}
	
	const getColor = (v) => {
		if(v < 0.45){
			return 'blue'
		} else if(v < 0.5){
			return 'cornflowerblue'
		} else if(v < 0.55){
			return 'burlywood'
		} else if(v < 0.95){
			return 'forestgreen'
		} else {
			return 'gray'
		}
	}

	const t = () => {
		let noise = new Noise(seed);
		generateMap(noise)
	}

	const refreshNoise = () => {
		let noise = new Noise(seed);
		generateMap(noise)
	}


	const handleChange = (event) => {
		const target = event.target;
		const name = target.name;
		switch (name) {
		  case "seed":
			setSeed(target.value)
			break;
		  case "octaves":
			setOctaves(target.value)
			break;
		case "zoom":
			setZoom(target.value)
			break;
		}
	  }

	return (
		<div className="App">
			<header className="App-header">
				<script src="noise.js"></script>

				
				<div
					className={"tyButton"}
					onClick={refreshNoise}
				>Refresh</div>
				<canvas ref={canvasRef} width={500} height={500} id="pixelCanvas"></canvas>

				<label>Seed<input
					name="seed"
					type="number"
					value={seed}
					onChange={handleChange}
				/></label>

				<label>Octaves<input
					name="octaves"
					type="number"
					value={octaves}
					onChange={handleChange}
				/></label>

				
				<label>Zoom<input
					name="zoom"
					type="number"
					value={zoom}
					onChange={handleChange}
				/></label>

				<div
					className={"tyButton"}
					onClick={() => setColored(!colored)}
				>{colored ? "colored" : "black and white"}</div>
			</header>
		</div>
	);
}

export default App;
