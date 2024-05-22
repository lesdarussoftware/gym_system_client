import { Button } from "@mui/base";

type SecondaryButtonProps = {
    text: string;
}

export function SecondaryButton({ text }: SecondaryButtonProps) {
    return (
        <Button className="btn btn-secondary">
            {text}
        </Button>
    );
}