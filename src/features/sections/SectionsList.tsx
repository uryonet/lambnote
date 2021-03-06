import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectNote } from 'features/notes/noteSlice'
import {
  setCurrentSectionInfo,
  selectSections,
  fetchSectionsData,
  createNewSection,
  changeSectionName,
  deleteSection
} from 'features/sections/sectionsSlice'
import { fetchPagesData } from '../pages/pagesSlice'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog'
import { ContextMenu } from 'primereact/contextmenu'
import { Menu } from 'primereact/menu'

export const SectionsList: React.FC = () => {
  const dispatch = useDispatch()
  const { lambnoteId } = useSelector(selectNote)
  const { currentSectionId, currentSectionName, sections } = useSelector(selectSections)
  const [newSectionName, setNewSectionName] = useState('')
  const [renewSectionName, setRenewSectionName] = useState('')
  const [newSectionDialog, setNewSectionDialog] = useState(false)
  const [renewSectionDialog, setRenewSectionDialog] = useState(false)
  const cm = useRef(null)
  const sectionMenuItems = [
    {
      label: '新規作成',
      command: () => {
        setNewSectionDialog(true)
      }
    },
    {
      label: '名前の変更',
      command: () => {
        setRenewSectionDialog(true)
      }
    },
    {
      label: '削除',
      command: () => {
        handleDelSection()
      }
    }
  ]

  useEffect(() => {
    if (lambnoteId) {
      dispatch(fetchSectionsData(lambnoteId))
    }
  }, [lambnoteId])

  useEffect(() => {
    setRenewSectionName(currentSectionName ?? '')
  }, [currentSectionName])

  const onChangeNewSection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSectionName(event.target.value)
  }

  const onChangeRenewSection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRenewSectionName(event.target.value)
  }

  const handleCreateSection = () => {
    setNewSectionDialog(false)
    dispatch(createNewSection(lambnoteId, newSectionName))
    setNewSectionName('')
  }

  const handleSection = (id: string | undefined, name: string | null | undefined) => {
    if (id && name) {
      dispatch(setCurrentSectionInfo({ currentSectionId: id, currentSectionName: name }))
      dispatch(fetchPagesData(id))
    }
  }

  const handleChangeSectionName = () => {
    setRenewSectionDialog(false)
    if (currentSectionId && renewSectionName) {
      dispatch(changeSectionName(currentSectionId, renewSectionName))
    }
  }

  const handleDelSection = () => {
    const result = window.confirm('セクションを削除します')
    if (result && currentSectionId) {
      dispatch(deleteSection(currentSectionId))
    }
  }

  return (
    <div className="sections-list">
      <div className="section-hedaer">
        <span>セクション</span>
        <Button
          icon="pi pi-ellipsis-h"
          className="p-button-rounded p-button-text"
          // @ts-ignore
          onClick={(event) => cm.current.toggle(event)}
        />
      </div>
      <ul className="list-items">
        {sections.map(({ id, displayName }) => {
          return (
            <li key={id} className={id === currentSectionId ? 'selected' : ''}>
              <a href="#" onClick={() => handleSection(id, displayName)}>
                {displayName}
              </a>
            </li>
          )
        })}
      </ul>

      <Dialog header="新規セクション作成" visible={newSectionDialog} onHide={() => setNewSectionDialog(false)}>
        <div className="p-formgroup-inline p-mt-3">
          <div className="p-field">
            <InputText value={newSectionName} onChange={onChangeNewSection} />
          </div>
          <Button label="作成" onClick={handleCreateSection} />
        </div>
      </Dialog>

      <Dialog header="セクション名前変更" visible={renewSectionDialog} onHide={() => setRenewSectionDialog(false)}>
        <div className="p-formgroup-inline p-mt-3">
          <div className="p-field">
            <InputText value={renewSectionName} onChange={onChangeRenewSection} />
          </div>
          <Button label="変更" onClick={handleChangeSectionName} />
        </div>
      </Dialog>

      <Menu model={sectionMenuItems} popup ref={cm} />
    </div>
  )
}
