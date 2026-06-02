import SplitCta from "@/components/ui/SplitCta";

type Props = {
    resumeUrl: string;
};

const ResumeCta = ({ resumeUrl }: Props) => (
    <SplitCta
        href={resumeUrl}
        label="Download CV"
        external
        heroEnter
        ariaLabel="Download CV in new tab"
    />
);

export default ResumeCta;
