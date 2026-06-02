import Head from "next/head";

interface Props {
    description : string
    title : string
}
const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Navjot Singh",
    jobTitle: "Software Engineer",
    url: "https://navjotsingh.dev",
    sameAs: [
        "https://www.linkedin.com/in/navjot-singh-b090b71ab/",
        "https://github.com/Navu4",
        "https://medium.com/@snav.jot5454",
    ],
    knowsAbout: [
        "React",
        "React Native",
        "Next.js",
        "TypeScript",
        "GraphQL",
        "Node.js",
    ],
};

const SEOComp = (props: Props) => {
    return (
        <Head>
            <meta
                name="description"
                content={props.description}
            />
            <meta
                property="og:title"
                content={props.title}
            />
            <meta
                name="og:description"
                content={props.description}
            />
            <meta
                name="twitter:title"
                content={props.title}
            />
            <meta
                name="twitter:description"
                content={props.description}
            />
            <meta
                name="keywords"
                content="Software Engineer, Web Developer, JavaScript, ReactJs, NextJs, NodeJs, Data Structure, Algorithms, Java, Java Servlet"
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
            />
        </Head>
    );
};
export default SEOComp;
