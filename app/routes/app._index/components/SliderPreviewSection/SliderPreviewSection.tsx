import { Card, Layout } from "@shopify/polaris";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import type { SliderObjectType, SlideType } from "../types";
import "./SliderPreviewSection.scss";
import SliderPreviewSectionItem from "./SliderPreviewSectionItem";

const SLIDE_WIDTH = 148;
const GAP = 16;
const SLIDE_HEIGHT = 264;

interface SliderPreviewSectionProps {
    videosPerRow: string;
    slides: SlideType[];
    currencyCode: string;
    updateSliderField: <K extends keyof SliderObjectType>(field: K, value: SliderObjectType[K]) => void;
    shop: string;
    autoScrollSeconds?: number;
}

export default function SliderPreviewSection({ videosPerRow, slides, updateSliderField, currencyCode, shop, autoScrollSeconds }: SliderPreviewSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [scale, setScale] = useState("1");
    const [containerWidth, setContainerWidth] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);

    const scrollLeft = () => {
        setScrollIndex((prev) => Math.max(0, prev - 1));
    };

    const scrollRight = () => {
        setScrollIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const updateSlides = (slide: SlideType) => {
        let updatedSlides = slides.map((sl) => {
            if (sl.videoId === slide.videoId) {
                return slide;
            }

            return sl;
        });
        updateSliderField("slides", updatedSlides);
    };

    const canScrollLeft = scrollIndex > 0;
    const canScrollRight = scrollIndex < maxIndex;

    useEffect(() => {
        const perRow = Number(videosPerRow);
        const slidesNumber = Math.min(perRow, slides.length);
        const width = slidesNumber * (SLIDE_WIDTH + GAP);
        setContainerWidth(width);

        const index = Math.max(0, slides.length - perRow);
        setMaxIndex(index);
        setScrollIndex(0);

        if (slidesNumber === 5) {
            setScale("0.9");
        }
        if (slidesNumber === 6) {
            setScale("0.8");
        }
    }, [slides.length, videosPerRow]);

    useEffect(() => {
        if (!autoScrollSeconds || maxIndex <= 0) return;

        const intervalMs = Math.max(1, autoScrollSeconds) * 1000;

        const id = setInterval(() => {
            setScrollIndex((prev) => {
                let next = prev + direction;

                if (next > maxIndex) {
                    setDirection(-1);
                    next = prev - 1;
                } else if (next < 0) {
                    setDirection(1);
                    next = prev + 1;
                }

                if (next > maxIndex) next = maxIndex;
                if (next < 0) next = 0;

                return next;
            });
        }, intervalMs);

        return () => clearInterval(id);
    }, [autoScrollSeconds, maxIndex, direction]);

    return (
        <Layout.Section>
            <Card padding="025">
                <div
                    className={clsx("slider", {
                        "slider--scaled-90": scale === "0.9",
                        "slider--scaled-80": scale === "0.8",
                    })}
                    style={
                        {
                            "--slide-width": `${SLIDE_WIDTH}px`,
                            "--slide-height": `${SLIDE_HEIGHT}px`,
                            "--gap": `${GAP}px`,
                            "--container-width": `${containerWidth}px`,
                            "--translate-x": `${scrollIndex * (SLIDE_WIDTH + GAP)}px`,
                        } as React.CSSProperties
                    }
                >
                    <div className="slider__viewport">
                        <button type="button" className={clsx("slider__nav", "slider__nav--left", { "is-hidden": !canScrollLeft })} aria-label="Previous" onClick={scrollLeft}>
                            &#10094;
                        </button>

                        <button type="button" className={clsx("slider__nav", "slider__nav--right", { "is-hidden": !canScrollRight })} aria-label="Next" onClick={scrollRight}>
                            &#10095;
                        </button>
                        <div ref={scrollRef} className="slider__track">
                            {slides.map((slide) => (
                                <SliderPreviewSectionItem key={slide.videoId} slide={slide} currencyCode={currencyCode} saveSlide={updateSlides} shop={shop} />
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </Layout.Section>
    );
}
