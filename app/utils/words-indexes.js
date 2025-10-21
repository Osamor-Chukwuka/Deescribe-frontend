export function WordsIndexes(sentence) {
    return sentence
        .split(" ")
        .map(word => word[0])
        .join("");
}