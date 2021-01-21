import Head from 'next/head';
import { useState, useEffect } from 'react';
import { Toolbar } from '../components/toolbar';
import imageUrlBuilder from '@sanity/image-url';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home({ posts }) {
	const [mappedPosts, setMappedPosts] = useState([]);

	const router = useRouter();

	useEffect(() => {
		if (posts.length) {
			const imageBuilder = imageUrlBuilder({
				projectId: '5mon5tdl',
				dataset: 'production',
			});

			setMappedPosts(
				posts.map((p) => {
					return {
						...p,
						mainImage: imageBuilder.image(p.mainImage).width(500).height(250),
					};
				})
			);
		} else {
			setMappedPosts([]);
		}
	}, [posts]);

	return (
		<>
			<Head>
				<title>Welcome to My Blog</title>
			</Head>
			<Toolbar />
			<div className={styles.main}>
				<h1>Welcome to my Simple Blog</h1>
				<h3>Recent Posts:</h3>
				<div className={styles.feed}>
					{mappedPosts.length ? (
						mappedPosts.map((p, index) => {
							return (
								<div
									key={index}
									className={styles.post}
									onClick={() => router.push(`/post/${p.slug.current}`)}
								>
									<h3>{p.title}</h3>
									<img className={styles.mainImage} src={p.mainImage} alt='' />
								</div>
							);
						})
					) : (
						<>No Posts Yes</>
					)}
				</div>
			</div>
		</>
	);
}

export const getServerSideProps = async (pageContext) => {
	const query = encodeURIComponent('*[ _type == "post" ]');

	const url = `https://5mon5tdl.api.sanity.io/v1/data/query/production?query=${query}`;

	const result = await fetch(url).then((res) => res.json());

	if (!result.result || !result.result.length) {
		return {
			props: {
				posts: [],
			},
		};
	} else {
		return {
			props: {
				posts: result.result,
			},
		};
	}
};
