import * as React from "react"

import { connect } from "react-redux"

import * as take from "lodash/take"

import * as ActionCreators from "./../ActionCreators"
import * as State from "./../State"

import { Icon } from "./../Icon"

import { HighlightTextByIndex } from "./HighlightText"
import { Visible } from "./Visible"

/**
 * Popup menu
 */
require("./Menu.less") // tslint:disable-line no-var-requires

export interface IMenuProps {
    visible: boolean
    selectedIndex: number
    filterText: string
    onChangeFilterText: (text: string) => void
    onSelect: (openInSplit: string, selectedIndex?: number) => void
    items: State.IMenuOptionWithHighlights[]
}

export class Menu extends React.PureComponent<IMenuProps, void> {

    private _inputElement: HTMLInputElement = null as any // FIXME: null

    componentDidMount(): void {
        console.log("mount")
    }

    componentWillUnmount(): void {
        console.log("unmount")
    }

    componentWillUpdate(): void {
        console.log("update")
    }

    public render(): null | JSX.Element {

        if (!this.props.visible) {
            return null
        }

        // TODO: sync max display items (10) with value in Reducer.popupMenuReducer() (Reducer.ts)
        const initialItems = take(this.props.items, 10)

        // const pinnedItems = initialItems.filter(f => f.pinned)
        // const unpinnedItems = initialItems.filter(f => !f.pinned)
        const items = initialItems.map((menuItem, index) => <MenuItem {...menuItem as any} // FIXME: undefined
            filterText={this.props.filterText}
            isSelected={index === this.props.selectedIndex}
            onClick={() => this.props.onSelect("e", index)}
            />)

        return <div className="menu-background enable-mouse">
            <div className="menu">
                <input type="text"
                    ref={(inputElement) => {
                        this._inputElement = inputElement
                        if (this._inputElement) {
                            this._inputElement.focus()
                        }
                    }}
                    onChange={(evt) => this._onChange(evt)}
                    />
                <div className="items">
                    {items}
                </div>
            </div>
        </div>
    }

    private _onChange(evt: React.FormEvent<HTMLInputElement>) {
        const target: any = evt.target
        this.props.onChangeFilterText(target.value)
    }
}

const EmptyArray: any[] = []

const mapStateToProps = (state: State.IState) => {
    if (!state.popupMenu) {
        return {
            visible: false,
            selectedIndex: 0,
            filterText: "",
            items: EmptyArray,
        }
    } else {
        const popupMenu = state.popupMenu
        return {
            visible: true,
            selectedIndex: popupMenu.selectedIndex,
            filterText: popupMenu.filter,
            items: popupMenu.filteredOptions,
        }
    }
}

const mapDispatchToProps = (dispatch: any) => {
    const dispatchFilterText = (text: string) => {
        dispatch(ActionCreators.filterMenu(text))
    }

    const selectItem = (openInSplit: string, selectedIndex: number) => {
        dispatch(ActionCreators.selectMenuItem(openInSplit, selectedIndex))
    }

    return {
        onChangeFilterText: dispatchFilterText,
        onSelect: selectItem,
    }
}

export const MenuContainer = connect(mapStateToProps, mapDispatchToProps)(Menu)

export interface IMenuItemProps {
    icon?: string
    isSelected: boolean
    filterText: string
    label: string
    labelHighlights: number[][]
    detail: string
    detailHighlights: number[][]
    pinned: boolean
    onClick: Function
}

export class MenuItem extends React.PureComponent<IMenuItemProps, void> {

    public render(): JSX.Element {
        let className = "item"

        if (this.props.isSelected) {
            className += " selected"
        }

        const icon = this.props.icon ? <Icon name={this.props.icon} /> : null

        return <div className={className} onClick={() => this.props.onClick()}>
            {icon}
            <HighlightTextByIndex className="label" text={this.props.label} highlightIndices={this.props.labelHighlights} highlightClassName={"highlight"} />
            <HighlightTextByIndex className="detail" text={this.props.detail} highlightIndices={this.props.detailHighlights} highlightClassName={"highlight"} />
            <Visible visible={this.props.pinned}>
                <Icon name="clock-o" />
            </Visible>
        </div>
    }
}
