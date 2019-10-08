/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from "react";

const style = {
    border: "1px solid gray",
    backgroundColor: "white",
};

type Props = {};
type State = {
    eyeHeight: number;
    eyeWidth: number;
    /** 虹彩半径 */
    irisR: number;
    eyeCenter: Vector2[];
};

export default class WatchingYou extends React.Component<Props, State> {
    constructor(prop: Readonly<Props>) {
        super(prop);
        this.state = {
            eyeHeight: 75,
            eyeWidth: 50,
            irisR: 15,
            eyeCenter: [{ x: 50, y: 75 }, { x: 160, y: 75 }],
        };
        this.canvasRef = React.createRef<HTMLCanvasElement>();
    }
    public componentDidMount(): void {
        if (!this.getContext()) {
            return;
        }
        document.addEventListener("mousemove", this.mouseMoveEvent);
    }

    private readonly mouseMoveEvent = (event: MouseEvent): void => {
        const { x, y } = this.convertCanvasPos(event.x, event.y);
        this.draw(x, y);
    };

    public componentWillUnmount(): void {
        document.removeEventListener("mousemove", this.mouseMoveEvent);
    }
    private convertCanvasPos(x: number, y: number): { x: number; y: number } {
        const rect = this.canvasRef!.current!.getBoundingClientRect();
        return { x: x - rect.left, y: y - rect.top };
    }

    private readonly draw = (x: number, y: number): void => {
        const ctx = this.getContext();
        ctx.clearRect(0, 0, this.canvasRef!.current!.width, this.canvasRef!.current!.height);
        this.state.eyeCenter.forEach(p => {
            this.drawEyeOuter(p);
            this.drawEyeBall(x, y, p);
        });
    };

    private drawEyeOuter(center: { x: number; y: number }): void {
        const ctx = this.getContext();

        ctx.beginPath();
        ctx.ellipse(center.x, center.y, this.state.eyeWidth, this.state.eyeHeight, 0, 0, 2 * Math.PI);
        ctx.stroke();
    }

    private drawEyeBall(x: number, y: number, center: { x: number; y: number }): void {
        const ctx = this.getContext();
        ctx.beginPath();
        const angle = Math.PI / 2 - Math.atan2(x - center.x, y - center.y);

        const ellipsePoint: Vector2 = {
            x: (this.state.eyeWidth - this.state.irisR * 2) * Math.cos(angle) + center.x,
            y: (this.state.eyeHeight - this.state.irisR * 2) * Math.sin(angle) + center.y,
        };

        // 楕円より内側
        if (
            Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2) <
            Math.sqrt((ellipsePoint.x - center.x) ** 2 + (ellipsePoint.y - center.y) ** 2)
        ) {
            ctx.arc(x, y, this.state.irisR * 2, 0, 2 * Math.PI);
            ctx.fill();
            return;
        }

        ctx.arc(ellipsePoint.x, ellipsePoint.y, this.state.irisR * 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    private readonly canvasRef: React.RefObject<HTMLCanvasElement> | null = null;

    private readonly getContext = (): CanvasRenderingContext2D => this.canvasRef!.current!.getContext("2d")!;

    public render(): React.ReactElement {
        return (
            <canvas
                id="EyeCanvas"
                width="210fpx"
                height="150px"
                ref={this.canvasRef}
                onMouseMove={(e): void => this.draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)}
                style={style}
            ></canvas>
        );
    }
}

type Vector2 = { x: number; y: number };
