var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled, { css } from "styled-components";
import { color, typography } from "../shared/styles";
import { rgba } from "polished";
export var Label = styled.label(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\tcursor: ", ";\n\tfont-size: ", "px;\n\tfont-weight: ", ";\n\tposition: relative;\n\theight: 1em;\n\tdisplay: flex;\n\talign-items: center;\n\topacity: ", ";\n"], ["\n\tcursor: ", ";\n\tfont-size: ", "px;\n\tfont-weight: ", ";\n\tposition: relative;\n\theight: 1em;\n\tdisplay: flex;\n\talign-items: center;\n\topacity: ", ";\n"])), function (props) { return (props.disabled ? "not-allowed" : "pointer"); }, typography.size.s2, typography.weight.bold, function (props) { return (props.disabled ? 0.5 : 1); });
export var OptionalText = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n\t", "\n"], ["\n\t", "\n"])), function (props) {
    return props.hideLabel && css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t\tborder: 0px !important;\n\t\t\tclip: rect(0 0 0 0) !important;\n\t\t\t-webkit-clip-path: inset(100%) !important;\n\t\t\tclip-path: inset(100%) !important;\n\t\t\theight: 1px !important;\n\t\t\toverflow: hidden !important;\n\t\t\tpadding: 0px !important;\n\t\t\tposition: absolute !important;\n\t\t\twhite-space: nowrap !important;\n\t\t\twidth: 1px !important;\n\t\t"], ["\n\t\t\tborder: 0px !important;\n\t\t\tclip: rect(0 0 0 0) !important;\n\t\t\t-webkit-clip-path: inset(100%) !important;\n\t\t\tclip-path: inset(100%) !important;\n\t\t\theight: 1px !important;\n\t\t\toverflow: hidden !important;\n\t\t\tpadding: 0px !important;\n\t\t\tposition: absolute !important;\n\t\t\twhite-space: nowrap !important;\n\t\t\twidth: 1px !important;\n\t\t"])));
});
export var Description = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n\tfont-size: ", "px;\n\tfont-weight: ", ";\n\tcolor: ", ";\n\tmargin-top: 4px;\n\tmargin-left: calc(", "px + 0.4em);\n\twidth: 100%;\n"], ["\n\tfont-size: ", "px;\n\tfont-weight: ", ";\n\tcolor: ", ";\n\tmargin-top: 4px;\n\tmargin-left: calc(", "px + 0.4em);\n\twidth: 100%;\n"])), typography.size.s1, typography.weight.regular, color.mediumdark, typography.size.s2);
export var RadioWrapper = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n\tdisplay: flex;\n\talign-items: center;\n\tflex-wrap: wrap;\n"], ["\n\tdisplay: flex;\n\talign-items: center;\n\tflex-wrap: wrap;\n"])));
export var Input = styled.input(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n\tmargin: 0 0.4em 0 0;\n\tfont-size: initial;\n\topacity: 0;\n\n\t& + span {\n\t\t&:before,\n\t\t&:after {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\theight: 1em;\n\t\t\twidth: 1em;\n\t\t\tcontent: \"\";\n\t\t\tdisplay: block;\n\t\t\tborder-radius: 3em;\n\t\t}\n\t}\n\n\t& + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset;\n\t}\n\n\t&:focus + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset;\n\t}\n\n\t&:checked + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset;\n\t}\n\n\t&:checked:focus + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset,\n\t\t\t", " 0 0 5px 2px;\n\t}\n\n\t& + span:after {\n\t\ttransition: all 150ms ease-out;\n\t\ttransform: scale3d(0, 0, 1);\n\n\t\theight: 10px;\n\t\tmargin-left: 2px;\n\t\tmargin-top: 2px;\n\t\twidth: 10px;\n\n\t\topacity: 0;\n\t}\n\n\t&:checked + span:after {\n\t\ttransform: scale3d(1, 1, 1);\n\t\tbackground: ", ";\n\t\topacity: 1;\n\t}\n"], ["\n\tmargin: 0 0.4em 0 0;\n\tfont-size: initial;\n\topacity: 0;\n\n\t& + span {\n\t\t&:before,\n\t\t&:after {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\theight: 1em;\n\t\t\twidth: 1em;\n\t\t\tcontent: \"\";\n\t\t\tdisplay: block;\n\t\t\tborder-radius: 3em;\n\t\t}\n\t}\n\n\t& + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset;\n\t}\n\n\t&:focus + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset;\n\t}\n\n\t&:checked + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset;\n\t}\n\n\t&:checked:focus + span:before {\n\t\tbox-shadow: ", " 0 0 0 1px inset,\n\t\t\t", " 0 0 5px 2px;\n\t}\n\n\t& + span:after {\n\t\ttransition: all 150ms ease-out;\n\t\ttransform: scale3d(0, 0, 1);\n\n\t\theight: 10px;\n\t\tmargin-left: 2px;\n\t\tmargin-top: 2px;\n\t\twidth: 10px;\n\n\t\topacity: 0;\n\t}\n\n\t&:checked + span:after {\n\t\ttransform: scale3d(1, 1, 1);\n\t\tbackground: ", ";\n\t\topacity: 1;\n\t}\n"])), color.mediumdark, function (props) { return color[props.appearance]; }, function (props) { return color[props.appearance]; }, function (props) { return color[props.appearance]; }, function (props) { return rgba(color[props.appearance], 0.3); }, function (props) { return color[props.appearance]; });
export var Error = styled.span(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n\tfont-weight: ", ";\n\tfont-size: ", "px;\n\tcolor: ", ";\n\tmargin-left: 6px;\n\theight: 1em;\n\tdisplay: flex;\n\talign-items: center;\n"], ["\n\tfont-weight: ", ";\n\tfont-size: ", "px;\n\tcolor: ", ";\n\tmargin-left: 6px;\n\theight: 1em;\n\tdisplay: flex;\n\talign-items: center;\n"])), typography.weight.regular, typography.size.s2, color.negative);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;