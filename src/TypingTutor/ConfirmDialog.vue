<template>
  <Teleport to="body">
    <transition name="dialog">
      <div v-if="isOpen" class="confirm-backdrop" @click.self="cancel">
        <div class="confirm-dialog">
          <div class="confirm-message">
            <slot name="message" />
          </div>
          <div v-if="$slots.warning" class="confirm-warning">
            <slot name="warning" />
          </div>
          <div class="confirm-actions">
            <button class="confirm-btn cancel" @click="cancel">{{ cancelLabel }}</button>
            <button class="confirm-btn confirm" @click="confirm" @keydown.enter="confirm">{{ confirmLabel }}</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  cancelLabel?: string
  confirmLabel?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.confirm-dialog {
  background: var(--bg-primary);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 20px 24px;
  max-width: 300px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: dialogIn 200ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

@keyframes dialogIn {
  from { opacity: 0; transform: scale(0.95) translateY(-8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.confirm-message {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.6;
  text-align: right;
}

.confirm-warning {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.5;
  text-align: right;
}

.confirm-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 4px;
}

.confirm-btn {
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: opacity 140ms;
}

.confirm-btn.cancel {
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.confirm-btn.cancel:hover { opacity: 0.8; }

.confirm-btn.confirm {
  background: var(--error-color);
  color: #fff;
}

.confirm-btn.confirm:hover { opacity: 0.88; }

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 200ms ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
