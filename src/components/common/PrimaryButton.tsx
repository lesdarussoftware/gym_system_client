import { Button } from "@mui/base";

type PrimaryButtonProps = {
    text: string;
}

export function PrimaryButton({ text }: PrimaryButtonProps) {
    return (
        <Button className="btn btn-primary">
            {text}
        </Button>
    );
}