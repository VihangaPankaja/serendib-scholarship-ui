import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import DataTableComponent from '../DataTableComponent/DataTableComponent';
import ModalButton from '../../components/ModalButton/ModalButton';
import axios from "axios";
import { useQueries } from "react-query";


const STUDENT_URL = process.env.REACT_APP_WS_HOST + "/student";
const SPONSOR_URL = process.env.REACT_APP_WS_HOST + "/sponsor";

const studentEmptyRow = { id: '', name: '', contactNo: '', email: '', university: '', course: '', startDate: '', endDate: '', sponsor: '', files: [] };
const sponsorEmptyRow = { id: '', name: '', contactNo: '', email: '' };

export default function TableComponent(props: any) {
    const WS_URL = props.type === 'student' ? STUDENT_URL : SPONSOR_URL;
    const arr = [props.type === 'student' ? 'student' : 'sponsor', 'sponsor'];

    const apis: any[] = useQueries(
        arr.map((s: string) => {
          return {
            queryKey: s,
            queryFn: () => axios.get(`${process.env.REACT_APP_WS_HOST}/${s}/`).then((res: any) => res && res.data && res.data.message ? res.data.message : []),
          };
        })
    );

    const columnData = {
        student: {
            columns: [
                {
                    key: 'id', name: 'ID', width: 10,
                    formatter(props: any) {
                        return (
                            <ModalButton detail={props.row} id={props.row.id} type={props.type} editRowHandler={editRowHandler} sponsorArr={apis[1].data} />
                        );
                    },
                },
                { key: 'name', name: 'Name' },
                { key: 'contactNo', name: 'Contact No' },
                { key: 'email', name: 'Email' },
                { key: 'university', name: 'Univeristy' },
                { key: 'course', name: 'Course of Study' },
                { key: 'startDate', name: 'Course Start Date',
                    formatter(props: any) {
                        return props && props.row && props.row.startDate ? props.row.startDate.split('T')[0] : ''
                    }
                },
                { key: 'endDate', name: 'Course End Date',
                    formatter(props: any) {
                        return props && props.row && props.row.endDate ? props.row.endDate.split('T')[0]: ''
                    }
                },
                { key: 'schoolEndDate', name: 'Schol. start Date' },
                { key: 'sponsor', name: 'Sponsor Name' },
                { key: 'files', name: 'files' }
            ]
        },
        sponsor: {
            columns: [
                {
                    key: 'id', name: 'ID', width: 10,
                    formatter(props: any) {
                        return (
                            <ModalButton detail={props.row} id={props.row.id} type={props.type} editRowHandler={editRowHandler} sponsorArr={apis[1].data} />
                        );
                    },
                },
                { key: 'name', name: 'Name' },
                { key: 'contactNo', name: 'Contact No' },
                { key: 'email', name: 'Email' },
                { key: 'files', name: 'files' }
            ]
        }
    };

    const addNewHandler = (row: any) => {
        axios.post(WS_URL, {
            ...row
        }).then(res => console.log(res)).catch(err => console.log(err));
    }

    const editRowHandler = (row: any) => {
        axios.patch(`${WS_URL}?id=${row.id}`, {
            ...row
        }).then(res => console.log(res)).catch(err => console.log(err));
    }

    return (
        <>
            <div style={{marginBottom: '10px', marginLeft: '88%'}}>
                <ModalButton 
                    detail={props.type === 'student' ? studentEmptyRow : sponsorEmptyRow} 
                    id={`Add New ${props.type}`} 
                    type={props.type}
                    isAddNew={true}
                    addNewHandler={addNewHandler}
                    sponsorArr={apis && apis[1] && apis[1].data ? apis[1].data : []}
                />
            </div>
            <DataTableComponent 
                columns={props.type === 'student' ? columnData.student.columns : columnData.sponsor.columns} 
                rows={apis && apis[0] && apis[0].data ? apis[0].data : []} 
                type= {props.type}
            />
        </>
    );
}
