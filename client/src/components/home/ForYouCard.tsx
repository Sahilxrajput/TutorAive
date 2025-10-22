import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function ForYouCard() {
    return (
        <Carousel className="w-9/10 mx-auto h-64">
            <CarouselContent className="h-full">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/3 h-full flex"
                    >
                        <Card className="flex flex-col h-full w-full overflow-hidden">
                            <CardHeader className="p-0">
                                <img
                                    src="../../assets/image/dsa.jpg"
                                    alt={`Card ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                />
                            </CardHeader>

                            <CardContent className="flex-1 flex items-center justify-center bg-green-600 text-white text-2xl font-semibold">
                                {index + 1}
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>

            <CarouselPrevious variant="secondary" />
            <CarouselNext variant="secondary" />
        </Carousel>
    );
}
