let continuedAnalyzer = true;
let invertedElement = '';
let letterCounter = 0;
let startAnalyzer = true;
let objPilhaAtual = '';
let iteration = 0;

let verdict = { 
	input: '', 
	stack: 'S'
};	

let notTerminalS = {
	0 : 'aBb',
	1 : 'bAc',
	2 : 'cCb',
	size : 3
}

let notTerminalA = {
	0 : 'aCb',
	1 : '',
	size : 2
}

let notTerminalB = {
	0 : 'aCa',
	1 : 'bAb',
	size : 2
}

let notTerminalC = {
	0 : 'aB',
	1 : 'cAc',
	size : 2
}

let notTerminals = {
	'S' : notTerminalS,
	'A' : notTerminalA,
	'B' : notTerminalB,
	'C' : notTerminalC
}

const insertVerdict = () => {
	let verdictPag = '';
	for(let i=0; i<verdict.input.length; i++) {
		verdictPag = `<li id="letter${i}"><a>${verdict.input[i]}</a></li>`;
		$('#pagination').append(verdictPag);
	}
}

const stepByStep = () => {
	$('#step-by-step').on('click', () => {
		if(startAnalyzer) {
			disabledTrueOrFalse('step-by-step');
			verdict.input = $('#verdict-input').val();
			insertVerdict();
			startAnalyzer = false;
		}
		tableAnalyzer();
	});
}

const verdictInput = () => {
	$('#verdict-input').keyup(() => {
		resetAnalyzer();
		let sentence = $('#verdict-input').val();
		if((sentence !== '')) {
			disabledTrueOrFalse('verdict-input-true');
		} else {
			disabledTrueOrFalse('verdict-input-false');
		}
	});
}

const executeAnalyzer = () => {
	if(startAnalyzer) {
		disabledTrueOrFalse('execute-analyzer');
		verdict.input = $('#verdict-input').val();
		insertVerdict();
		startAnalyzer = false;
	}	
	tableAnalyzer();
	if(continuedAnalyzer) {
		setTimeout(
			executeAnalyzer,
			300
		);
	}
}

const generateSentence = () => {
	$('#generate-sentence').on('click', () => {
		disabledTrueOrFalse('generate-sentence-true');
		let element = 'S';
		while(changeElement(element)) {
			console.log("teste")
			$('#verdict-input').val(element);
			element = setSentence(element);
		}
		$('#verdict-input').val(element);
		return element;
	});
}

const setSentence = element => {
	let result = '';
	for (let i=0; i<element.length; i++){
		let arrayElement = element[i];
		if (testLetters(arrayElement)){
			let temp = searchForPossibility(arrayElement);
			result += temp;
		} else {
			result += arrayElement;
		}
	}
	return result;
}

const searchForPossibility = element => {
	console.log("eita: " + element)
	let alvo = toDrawElement(notTerminals[element].size);
	console.log("alvo: " + alvo)
	return notTerminals[element][alvo];
}

const toDrawElement = element => {
	let result = Math.floor(Math.random() * element);
	return result;
}

const changeElement = element => {
	console.log("element: "+ element)
	for (let i=0; i<element.length; i++){
		if (testLetters(element[i])){
			return true;
		}
	}
	return false;
}

const testLetters = element => {
	if((element.charCodeAt(0) >= 65) && (element.charCodeAt(0) <= 90)){
		return true;
	}
	return false;
}

const reverseElement = element => {
	invertedElement = element.split('').reverse().join('');
	return invertedElement;
}

const tableAnalyzer = () => {
	if (continuedAnalyzer) {
		let lastStack = verdict.stack[verdict.stack.length-1];
		let firstStack = verdict.input[0];
		console.log("lastStack:"+lastStack)
		console.log("firstStack:"+firstStack)	
		let tBody = '<tr>'
		iteration++;
		tBody += `<td class="tbl-lett-spac"><b>${iteration}</b></td>`
        tBody += `<td class="tbl-lett-spac"><span class="spac-td-left"><b>$</b>${verdict.stack}</span></td>`
        tBody += `<td class="tbl-lett-spac"><span class="spac-td-right">${verdict.input}<b>$</b></span></td>`;
		if(lastStack == firstStack) {
			verdict.stack = verdict.stack.substring(0, verdict.stack.length-1);
			verdict.input = verdict.input.substring(1, verdict.input.length);
			if(firstStack != null && lastStack != null) {
                tBody += `<td>Lê <b>${firstStack}</b></td>`
                tBody += '</tr>';				
				$(`#letter${letterCounter} a`).addClass('active');
				letterCounter++;
			} else {
                tBody += `<td><span class="td-accept">Ok</span> em <b>${iteration}</b> iterações</td>`
                tBody += '</tr>';
				continuedAnalyzer = false;
				$('#step-by-step').addClass('disabled');
			}
		} else {
			let alvo = lastStack + firstStack;
			console.log("alvo: " + alvo)
			if(alvo != null) {
				let alvoId = $(`#${alvo}`).text();
				console.log("alvoId: " + alvoId)
				if (alvoId.length == 0) {
                    tBody += `<td><b><span class="td-error">Erro</span> em ${iteration} iterações</b></td>`
                    tBody += '</tr>';
					$(`#letter${letterCounter} a`).addClass('error');
					letterCounter++;
					continuedAnalyzer = false;
					$('#step-by-step').addClass('disabled');
				} else {
					let alvoSplit = alvoId.split('->')
					if (alvoSplit.length == 2) {
						let alvoOk = alvoSplit[1];
						let remonteAlvoId = alvoSplit[0];
						remonteAlvoId += '<b class="no-tbl-lett-spac">-></b>';
						remonteAlvoId += alvoSplit[1];
						reverseElement(alvoOk);
						if ('ε' == invertedElement) {
							invertedElement = '';
						}
						verdict.stack = verdict.stack.substring(0, verdict.stack.length-1);
						verdict.stack = verdict.stack + invertedElement;
                        tBody += `<td class="tbl-lett-spac">${remonteAlvoId}</td>`
                        tBody += '</tr>';
					}
				}
			}
		}
		$('#tbody-stack').append(tBody);
	}
}

const resetAnalyzer = () => {
	continuedAnalyzer = true;
	invertedElement = '';
	letterCounter = 0;
	startAnalyzer = true;
	objPilhaAtual = '';
	iteration = 0;
	verdict = { 
		input: '', 
		stack: 'S'
	};	
	notTerminalS = {
		0 : 'aBb',
		1 : 'bAc',
		2 : 'cCb',
		size : 3
	}
	notTerminalA = {
		0 : 'aCb',
		1 : '',
		size : 2
	}
	notTerminalB = {
		0 : 'aCa',
		1 : 'bAb',
		size : 2
	}
	notTerminalC = {
		0 : 'aB',
		1 : 'cAc',
		size : 2
	}
	notTerminals = {
		'S' : notTerminalS,
		'A' : notTerminalA,
		'B' : notTerminalB,
		'C' : notTerminalC
	}
	$('#tbody-stack').html('');
	$('#pagination').html('');
}

const disabledTrueOrFalse = element => {
	if(element === 'step-by-step') {
		$('#execute-analyzer').addClass('disabled');
		$('#generate-sentence').addClass('disabled');
	} else if(element === 'execute-analyzer') {
		$('#execute-analyzer').addClass('disabled');
		$('#step-by-step').addClass('disabled');
		$('#generate-sentence').addClass('disabled');
	} else if(element === 'verdict-input-true') {
		$('#execute-analyzer').removeClass('disabled');
		$('#clean-analyzer').removeClass('disabled');
		$('#step-by-step').removeClass('disabled');
	} else if(element === 'verdict-input-false') {
		$('#execute-analyzer').addClass('disabled');
		$('#clean-analyzer').addClass('disabled');
		$('#step-by-step').addClass('disabled');
	} else if(element === 'generate-sentence-true') {
		$('#execute-analyzer').removeClass('disabled');
		$('#clean-analyzer').removeClass('disabled');
		$('#step-by-step').removeClass('disabled');
	}
}

const cleanAnalyzer = () => {
	$('#clean-analyzer').on('click', () => {
		window.location.reload();
	});
}

$(document).ready(() => {
	verdictInput();
	generateSentence();
	stepByStep();
    cleanAnalyzer();
});