import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
interface ResuableTooltipProps {
  text: string;
}

const ResuableTooltip = ({ text }: ResuableTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={`truncate max-w-[100%]`}>
          {text}
        </TooltipTrigger>
        <TooltipContent
          className={`break-words bg-[#007C85] text-white overflow-visible max-w-[429px]`}
        >
          <p className="relative z-[51]">{text}</p>
          <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#007C85] rotate-45 z-[49]"></div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ResuableTooltip;
