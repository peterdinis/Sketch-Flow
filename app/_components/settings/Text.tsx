import {
    fontFamilyOptions,
    fontSizeOptions,
    fontWeightOptions,
} from '@/app/_constants';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@radix-ui/react-select';

const selectConfigs = [
    {
        property: 'fontFamily',
        placeholder: 'Choose a font',
        options: fontFamilyOptions,
    },
    { property: 'fontSize', placeholder: '30', options: fontSizeOptions },
    {
        property: 'fontWeight',
        placeholder: 'Semibold',
        options: fontWeightOptions,
    },
];

type TextProps = {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    handleInputChange: (property: string, value: string) => void;
};

const Text = ({
    fontFamily,
    fontSize,
    fontWeight,
    handleInputChange,
}: TextProps) => (
    <div className='border-primary-grey-200 flex flex-col gap-3 border-b px-5 py-3'>
        <h3 className='text-[10px] uppercase'>Text</h3>

        <div className='flex flex-col gap-3'>
            {RenderSelect({
                config: selectConfigs[0],
                fontSize,
                fontWeight,
                fontFamily,
                handleInputChange,
            })}

            <div className='flex gap-2'>
                {selectConfigs.slice(1).map((config) =>
                    RenderSelect({
                        config,
                        fontSize,
                        fontWeight,
                        fontFamily,
                        handleInputChange,
                    }),
                )}
            </div>
        </div>
    </div>
);

type Props = {
    config: {
        property: string;
        placeholder: string;
        options: { label: string; value: string }[];
    };
    fontSize: string;
    fontWeight: string;
    fontFamily: string;
    handleInputChange: (property: string, value: string) => void;
};

const RenderSelect = ({
    config,
    fontSize,
    fontWeight,
    fontFamily,
    handleInputChange,
}: Props) => (
    <Select
        key={config.property}
        onValueChange={(value) => handleInputChange(config.property, value)}
        value={
            config.property === 'fontFamily'
                ? fontFamily
                : config.property === 'fontSize'
                  ? fontSize
                  : fontWeight
        }
    >
        <SelectTrigger className='w-full rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500'>
            <SelectValue
                placeholder={
                    config.property === 'fontFamily'
                        ? 'Choose a font'
                        : config.property === 'fontSize'
                          ? '30'
                          : 'Semibold'
                }
            />
        </SelectTrigger>
        <SelectContent className='rounded-lg border border-gray-700 bg-zinc-950 mt-2 shadow-lg'>
            {config.options.map((option) => (
                <SelectItem
                    key={option.value}
                    value={option.value}
                    className='px-2 py-1 hover:bg-gray-800'
                >
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

export default Text;