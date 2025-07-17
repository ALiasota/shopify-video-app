import { TextField, IndexFilters, useSetIndexFiltersMode, IndexFiltersMode, Box, Combobox, Icon, Listbox, InlineStack, Button, Popover, ResourceList } from "@shopify/polaris";
import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { SearchIcon, ListBulletedIcon, ShopcodesIcon } from "@shopify/polaris-icons";
import type { FilterOptionsType } from "../types";
import { SortedOptionsEnum, ViewTypeEnum } from "../types";

const tabs: TabProps[] = [];

const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Date", value: SortedOptionsEnum.DATE_ASC, directionLabel: "Descending (A-Z)" },
    { label: "Date", value: SortedOptionsEnum.DATE_DESC, directionLabel: "Ascending (Z-A)" },
    { label: "Name", value: SortedOptionsEnum.NAME_ASC, directionLabel: "Descending (A-Z)" },
    { label: "Name", value: SortedOptionsEnum.NAME_DESC, directionLabel: "Ascending (Z-A)" },
    { label: "Size", value: SortedOptionsEnum.SIZE_ASC, directionLabel: "Descending (A-Z)" },
    { label: "Size", value: SortedOptionsEnum.SIZE_DESC, directionLabel: "Ascending (Z-A)" },
];

const viewList = [
    { name: "Grid view", initials: ViewTypeEnum.GRID },
    { name: "List view", initials: ViewTypeEnum.LIST },
];

const productList = [
    { value: "rustic", label: "Rustic" },
    { value: "antique", label: "Antique" },
    { value: "vinyl", label: "Vinyl" },
    { value: "vintage", label: "Vintage" },
    { value: "refurbished", label: "Refurbished" },
];

interface VideoListFilterProps {
    setFilterOptions: (options: FilterOptionsType) => void;
}

export default function VideoListFilter({ setFilterOptions }: VideoListFilterProps) {
    const [sortSelected, setSortSelected] = useState<SortedOptionsEnum[]>([SortedOptionsEnum.DATE_ASC]);
    const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

    const [queryValue, setQueryValue] = useState("");
    const [minSize, setMinSize] = useState("");
    const [maxSize, setMaxSize] = useState("");
    const [productName, setProductName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const [productOptions, setProductOptions] = useState(productList);
    const [viewActive, setViewActive] = useState(false);
    const [viewType, setViewType] = useState<ViewTypeEnum>(ViewTypeEnum.GRID);
    const [sizeMinError, setSizeMinError] = useState(false);
    const [sizeMaxError, setSizeMaxError] = useState(false);

    const handleMinSizeChange = useCallback(
        (value: string) => {
            if (maxSize && value.length && Number(maxSize) <= Number(value)) {
                setSizeMinError(true);
            } else {
                setSizeMinError(false);
            }
            setMinSize(value);
        },
        [maxSize],
    );
    const handleMaxSizeChange = useCallback(
        (value: string) => {
            if (minSize && value.length && Number(minSize) >= Number(value)) {
                setSizeMaxError(true);
            } else {
                setSizeMaxError(false);
            }
            setMaxSize(value);
        },
        [minSize],
    );
    const handleProductChange = useCallback(
        (value: string) => {
            const product = productList.find((prod) => prod.value === value);
            if (product) {
                setSelectedProduct(product);
                setProductName("");
            }
        },
        [productList],
    );

    const handleFiltersQueryChange = useCallback((value: string) => setQueryValue(value), []);

    const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
    const handleSizeRemove = useCallback(() => {
        setMinSize("");
        setMaxSize("");
        setSizeMinError(false);
        setSizeMaxError(false);
    }, []);
    const handleProductRemove = useCallback(() => setSelectedProduct(null), []);
    const handleFiltersClearAll = useCallback(() => {
        handleSizeRemove();
        handleQueryValueRemove();
        handleProductRemove();
        setSizeMinError(false);
        setSizeMaxError(false);
    }, [handleProductRemove, handleQueryValueRemove, handleSizeRemove]);

    const escapeSpecialRegExCharacters = useCallback((value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), []);

    const handleProductNameChange = useCallback(
        (value: string) => {
            setProductName(value);

            setTimeout(() => {
                if (value === "") {
                    setProductOptions(productList);
                    return;
                }
                const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), "i");
                const resultOptions = productOptions.filter((option) => option.label.match(filterRegex));
                setProductOptions(resultOptions);
            }, 300);
        },
        [productList, productOptions, escapeSpecialRegExCharacters],
    );

    const handleViewListItemClick = useCallback((value: ViewTypeEnum) => {
        setViewType(value);
        setViewActive(false);
    }, []);

    const toggleViewActive = useCallback(() => setViewActive((popoverActive) => !popoverActive), []);

    const optionsMarkup =
        productOptions.length > 0
            ? productOptions.map((option) => {
                  const { label, value } = option;

                  return (
                      <Listbox.Option key={`${value}`} value={value} selected={selectedProduct?.value === value} accessibilityLabel={label}>
                          {label}
                      </Listbox.Option>
                  );
              })
            : null;

    const listboxMarkup = <Listbox onSelect={handleProductChange}>{optionsMarkup}</Listbox>;
    const filters = [
        {
            key: "size",
            label: "Size",
            filter: (
                <Box>
                    <TextField
                        error={sizeMinError ? "Min should be less than Max" : undefined}
                        label="Min size (MB)"
                        value={minSize}
                        onChange={handleMinSizeChange}
                        autoComplete="off"
                        type="number"
                        min={0}
                    />
                    <TextField
                        error={sizeMaxError ? "Max should be bigger than Min" : undefined}
                        label="Max size (MB)"
                        value={maxSize}
                        onChange={handleMaxSizeChange}
                        autoComplete="off"
                        type="number"
                        min={0}
                    />
                </Box>
            ),
            shortcut: false,
            onRemove: handleSizeRemove,
        },
        {
            key: "product",
            label: "Product",
            filter: (
                <Combobox
                    activator={
                        <Combobox.TextField
                            prefix={<Icon source={SearchIcon} />}
                            onChange={handleProductNameChange}
                            label=""
                            labelHidden
                            value={productName}
                            placeholder="Search for products"
                            autoComplete="off"
                        />
                    }
                >
                    {listboxMarkup}
                </Combobox>
            ),
            shortcut: false,
            onRemove: handleProductRemove,
        },
    ];

    const viewActivator = <Button icon={viewType === "grid" ? ShopcodesIcon : ListBulletedIcon} onClick={toggleViewActive} disclosure />;

    useEffect(() => {
        setFilterOptions({
            queryValue,
            minSize: sizeMinError ? null : minSize,
            maxSize: sizeMaxError ? null : maxSize,
            selectedProduct: selectedProduct ? selectedProduct.value : null,
            viewType,
            sortSelected,
        });
    }, [maxSize, minSize, queryValue, selectedProduct, setFilterOptions, sizeMaxError, sizeMinError, sortSelected, viewType]);

    return (
        <InlineStack wrap={false} gap="200">
            <IndexFilters
                sortOptions={sortOptions}
                sortSelected={sortSelected}
                queryValue={queryValue}
                queryPlaceholder="Searching videos"
                onQueryChange={handleFiltersQueryChange}
                onQueryClear={() => setQueryValue("")}
                onSort={(value) => setSortSelected(value as SortedOptionsEnum[])}
                tabs={tabs}
                selected={0}
                filters={filters}
                onClearAll={handleFiltersClearAll}
                mode={mode}
                setMode={setMode}
                appliedFilters={[
                    {
                        key: "size",
                        label: sizeMinError || sizeMaxError ? "" : `Size: ${minSize || ""} - ${maxSize || ""} MB`,
                        onRemove: () => {
                            setMinSize("");
                            setMaxSize("");
                            setSizeMinError(false);
                            setSizeMaxError(false);
                        },
                    },
                    {
                        key: "product",
                        label: `Product: ${selectedProduct ? selectedProduct.label : ""}`,
                        onRemove: () => {
                            setSelectedProduct(null);
                        },
                    },
                ]}
            />
            <Box paddingBlockStart="200">
                <Popover sectioned active={viewActive} activator={viewActivator} onClose={toggleViewActive} ariaHaspopup={false}>
                    <Popover.Pane>
                        <ResourceList
                            items={viewList}
                            renderItem={({ name, initials }) => (
                                <ResourceList.Item id={name} onClick={() => handleViewListItemClick(initials as ViewTypeEnum)}>
                                    <InlineStack wrap={false} gap="200">
                                        <Icon source={initials === "grid" ? ShopcodesIcon : ListBulletedIcon} />
                                        {name}
                                    </InlineStack>
                                </ResourceList.Item>
                            )}
                        />
                    </Popover.Pane>
                </Popover>
            </Box>
        </InlineStack>
    );
}
