import Image from "next/image";

export const CoverImage = ({ src, className, style }) => {
	return (
		<Image
			src={src}
			priority={true}
			alt="Обложка трека"
			className={className}
			height={400}
			width={400}
			style={style}
		/>
	);
};
