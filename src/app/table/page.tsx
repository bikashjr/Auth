"use client"

import React from 'react'

import './index.css'

import {
    useReactTable,
    makeStateUpdater,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getCoreRowModel,
    flexRender,
    TableFeature,
    Table,
    RowData,
    OnChangeFn,
    ColumnDef,
    Column,
    Updater,
    functionalUpdate,
} from '@tanstack/react-table'

import { makeData, Person } from './makeData'


export type DensityState = 'sm' | 'md' | 'lg'
export interface DensityTableState {
    density: DensityState
}

export interface DensityOptions {
    enableDensity?: boolean
    onDensityChange?: OnChangeFn<DensityState>
}

export interface DensityInstance {
    setDensity: (updater: Updater<DensityState>) => void
    toggleDensity: (value?: DensityState) => void
}

declare module '@tanstack/react-table' {
    interface TableState extends DensityTableState { }
    interface TableOptionsResolved<TData extends RowData>
        extends DensityOptions { }
    interface Table<TData extends RowData> extends DensityInstance { }
}

export const DensityFeature: TableFeature<any> = {
    getInitialState: (state): DensityTableState => {
        return {
            density: 'md',
            ...state,
        }
    },

    getDefaultOptions: <TData extends RowData>(
        table: Table<TData>
    ): DensityOptions => {
        return {
            enableDensity: true,
            onDensityChange: makeStateUpdater('density', table),
        } as DensityOptions
    },
    createTable: <TData extends RowData>(table: Table<TData>): void => {
        table.setDensity = updater => {
            const safeUpdater: Updater<DensityState> = old => {
                let newState = functionalUpdate(updater, old)
                return newState
            }
            return table.options.onDensityChange?.(safeUpdater)
        }
        table.toggleDensity = value => {
            table.setDensity(old => {
                if (value) return value
                return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg'
            })
        }
    },

}
export default function App() {
    const columns = React.useMemo<ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'firstName',
                cell: info => info.getValue(),
                footer: props => props.column.id,
            },
            {
                accessorFn: row => row.lastName,
                id: 'lastName',
                cell: info => info.getValue(),
                header: () => <span>Last Name</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'age',
                header: () => 'Age',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'visits',
                header: () => <span>Visits</span>,
                footer: props => props.column.id,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                footer: props => props.column.id,
            },
            {
                accessorKey: 'progress',
                header: 'Profile Progress',
                footer: props => props.column.id,
            },
        ],
        []
    )

    const [data, _setData] = React.useState(() => makeData(1000))
    const [density, setDensity] = React.useState<DensityState>('md')

    const table = useReactTable({
        _features: [DensityFeature],
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            density,
        },
        onDensityChange: setDensity,
    })

    return (
        <div className="p-2">
            <div className="h-2" />
            <button
                onClick={() => table.toggleDensity()}
                className="border rounded p-1 bg-blue-500 text-white mb-2 w-64"
            >
                Toggle Density
            </button>
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{
                                            padding:
                                                density === 'sm'
                                                    ? '4px'
                                                    : density === 'md'
                                                        ? '8px'
                                                        : '16px',
                                            transition: 'padding 0.2s',
                                        }}
                                    >
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? 'cursor-pointer select-none'
                                                    : '',
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                        {header.column.getCanFilter() ? (
                                            <div>
                                                <Filter column={header.column} table={table} />
                                            </div>
                                        ) : null}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td
                                            key={cell.id}
                                            style={{
                                                //using our new feature
                                                padding:
                                                    density === 'sm'
                                                        ? '4px'
                                                        : density === 'md'
                                                            ? '8px'
                                                            : '16px',
                                                transition: 'padding 0.2s',
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount().toLocaleString()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
                {table.getRowCount().toLocaleString()} Rows
            </div>
            <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
        </div>
    )
}

function Filter({
    column,
    table,
}: {
    column: Column<any, any>
    table: Table<any>
}) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id)

    const columnFilterValue = column.getFilterValue()

    return typeof firstValue === 'number' ? (
        <div className="flex space-x-2">
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[0] ?? ''}
                onChange={e =>
                    column.setFilterValue((old: [number, number]) => [
                        e.target.value,
                        old?.[1],
                    ])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <input
                type="number"
                value={(columnFilterValue as [number, number])?.[1] ?? ''}
                onChange={e =>
                    column.setFilterValue((old: [number, number]) => [
                        old?.[0],
                        e.target.value,
                    ])
                }
                placeholder={`Max`}
                className="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <input
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={e => column.setFilterValue(e.target.value)}
            placeholder={`Search...`}
            className="w-36 border shadow rounded"
        />
    )
}

