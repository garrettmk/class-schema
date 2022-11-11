import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional } from "class-validator";
import { and, not, PropertyRuleSet } from "@/metadata-rules";
import { BooleanFieldMetadata, GenericFieldMetadata, PrototypeTargetContext } from "./property-metadata-types";
import { decorateProperty, decoratePropertyWith, setPropertyFaker } from "./property-metadata-actions";
import { innerTypeExtends, innerTypeMatches, isArrayField, isConstructorField, isFakerUnset, propertyMetadataMatches } from "./property-metadata-selectors";
import { getTypeInfo } from "./util/get-type-info";
import { getInnerType } from "./util/inner-type";

export const optional = true;

export const commonRules = new PropertyRuleSet<GenericFieldMetadata, PrototypeTargetContext>([
    {
        if: propertyMetadataMatches({ optional }),
        then: decorateProperty(IsOptional())
    },
    {
        if: isArrayField(),
        then: decorateProperty(IsArray())
    },
    {
        if: and(
            innerTypeExtends(Function),
            not(innerTypeMatches(Boolean, Number, String, Date))
        ),
        then: decoratePropertyWith(metadata => Type(() => getInnerType(metadata.type)))
    }
]);

export const booleanRules = new PropertyRuleSet<BooleanFieldMetadata, PrototypeTargetContext>([
    {
        if: innerTypeExtends(Boolean),
        then: [
            decoratePropertyWith(metadata => IsBoolean({
                each: getTypeInfo(metadata.type).isArray
            })),

            {
                if: isFakerUnset(),
                then: setPropertyFaker()
            }
        ]
    }
])