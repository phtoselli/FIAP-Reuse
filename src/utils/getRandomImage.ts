export enum Topics {
	PRODUCT = "product",
	ELECTRONICS = "electronics",
	FURNITURE = "furniture",
	GADGETS = "gadgets",
	FASHION = "fashion",
	ACCESSORIES = "accessories",
}

export default function getRandomImage(topic?: Topics) {
	const topics = Object.values(Topics);

	const chosenTopic =
		topic && topics.includes(topic)
			? topic
			: topics[Math.floor(Math.random() * topics.length)];

	return `https://source.unsplash.com/random/500x400?${chosenTopic}&sig=${Math.random()}`;
}
