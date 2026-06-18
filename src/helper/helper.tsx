const capitalizeWords = (text: string) => {
    return text
	.split(' ')
	.map(word => word.charAt(0).toUpperCase() + word.slice(1))
	.join(' ');
}

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export {
    capitalizeWords,
    delay
}