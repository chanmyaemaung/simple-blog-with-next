import Head from 'next/head';
import imageUrlBuilder from '@sanity/image-url';
import BlockContent from '@sanity/block-content-to-react';
import { useState, useEffect } from 'react';
import styles from '../../styles/Post.module.css';
import { Toolbar } from '../../components/toolbar';

export const Post = ({ title, body, image }) => {
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
		const imageBuilder = imageUrlBuilder({
			projectId: '5mon5tdl',
			dataset: 'production',
		});

		setImageUrl(imageBuilder.image(image));
	}, [image]);

	return (
		<div>
			<Head>
				<title>{`${title}`}</title>
				<meta name='description' content={`${body}`} />

				<meta property='og:image' content={`${imageUrl}`} />
				<meta property='og:title' content={`${title}`} />
				<meta property='og:description' content={`${body}`} />

				<meta property='twitter:image' content={`${imageUrl}`} />
				<meta property='twitter:title' content={`${title}`} />
				<meta property='twitter:description' content={`${body}`} />
			</Head>
			<Toolbar />
			<div className={styles.main}>
				<h1>{title}</h1>
				{imageUrl && <img src={imageUrl} className={styles.mainImage} />}
				<div className={styles.body}>
					<BlockContent blocks={body} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async (pageContext) => {
	const pageSlug = pageContext.query.slug;

	if (!pageSlug) {
		return {
			notFound: true,
		};
	}

	const query = encodeURIComponent(
		`*[ _type == 'post' && slug.current == '${pageSlug}' ]`
	);

	const url = `https://5mon5tdl.api.sanity.io/v1/data/query/production?query=${query}`;

	const result = await fetch(url).then((res) => res.json());

	const post = result.result[0];

	if (!post) {
		return {
			notFound: true,
		};
	} else {
		return {
			props: {
				title: post.title,
				body: post.body,
				image: post.mainImage,
			},
		};
	}
};

export default Post;
