import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import useIsTruncated from "../hooks/useIsTruncated";

interface ResuableTooltipProps {
  text: string;
}

const ResuableTooltip = ({ text }: ResuableTooltipProps) => {
  const [isTruncated, textRef] = useIsTruncated(text);

  return (
    <div ref={textRef} className="truncate max-w-[100%]">
      {isTruncated ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="truncate max-w-[100%]">
              {text}
            </TooltipTrigger>
            <TooltipContent className="break-words bg-[#007C85] text-white overflow-visible max-w-[429px]">
              <p className="relative z-[51]">{text}</p>
              <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#007C85] rotate-45 z-[49]"></div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default ResuableTooltip;
